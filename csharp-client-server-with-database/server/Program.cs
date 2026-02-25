using System.Data;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.FileProviders;
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Keep JSON field names as declared in records to match frontend payloads exactly.
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
});

var app = builder.Build();

// Read database settings from environment so deployment config stays outside source code.
var dbConfig = new DbConfig(
    Host: Environment.GetEnvironmentVariable("MYSQL_HOSTNAME") ?? "localhost",
    User: Environment.GetEnvironmentVariable("MYSQL_USER") ?? "exampleuser",
    Password: Environment.GetEnvironmentVariable("MYSQL_PASSWORD") ?? "examplepass",
    Database: Environment.GetEnvironmentVariable("MYSQL_DATABASE") ?? "exampledb",
    Port: 3306
);

// Fail fast on startup if DB is unreachable/misconfigured.
await EnsureDatabaseIsReachable(dbConfig);

// Serve frontend assets from /public under /static.
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "public")),
    RequestPath = "/static"
});

app.MapGet("/", () => Results.Redirect("/static/index.html"));

app.MapGet("/special_path", () => Results.Text("This is another path"));

app.MapGet("/request_info", (HttpRequest request) =>
{
    var headers = request.Headers.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
    return Results.Text("This is all I got from the request: " + System.Text.Json.JsonSerializer.Serialize(headers));
});

app.MapPost("/client_post", async (HttpRequest request) =>
{
    var body = await request.ReadFromJsonAsync<ClientPostBody>();
    if (body is null || string.IsNullOrWhiteSpace(body.post_content))
    {
        return Results.BadRequest(new { message = "This function requires a body with \"post_content\"" });
    }

    return Results.Ok(new { message = $"I got your message: {body.post_content}" });
});

app.MapPost("/button1_name", async (HttpRequest request) =>
{
    // Endpoint supports both form posts and JSON payloads.
    var name = await ExtractName(request);
    return Results.Ok(new { message = $"I got your message - Name is: {name}" });
});

app.MapGet("/button2", () => Results.Text($"Antwort: {Random.Shared.NextDouble():F5}"));

app.MapGet("/database", async () =>
{
    try
    {
        // Open a short-lived connection per request via pooled MySqlConnector connections.
        await using var conn = await OpenConnectionWithRetry(dbConfig);
        await using var cmd = new MySqlCommand("SELECT task_id, title, description, created_at FROM table1", conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var list = new List<DatabaseEntry>();
        while (await reader.ReadAsync())
        {
            list.Add(new DatabaseEntry(
                task_id: reader.GetInt32("task_id"),
                title: reader.GetString("title"),
                description: reader.IsDBNull("description") ? "" : reader.GetString("description"),
                created_at: reader.GetDateTime("created_at")
            ));
        }

        return Results.Ok(list);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message, statusCode: 500);
    }
});

app.MapPost("/database", async (DatabaseInsertBody body) =>
{
    if (string.IsNullOrWhiteSpace(body.title) || string.IsNullOrWhiteSpace(body.description))
    {
        return Results.BadRequest(new { message = "This function requires a body with \"title\" and \"description\"" });
    }

    try
    {
        // Parameterized SQL to avoid injection and keep values typed.
        await using var conn = await OpenConnectionWithRetry(dbConfig);
        await using var cmd = new MySqlCommand(
            "INSERT INTO table1 (title, description, created_at) VALUES (@title, @description, CURRENT_TIMESTAMP)", conn);
        cmd.Parameters.AddWithValue("@title", body.title);
        cmd.Parameters.AddWithValue("@description", body.description);
        await cmd.ExecuteNonQueryAsync();

        return Results.Ok(new { message = "Inserted" });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message, statusCode: 500);
    }
});

app.MapDelete("/database/{id:int}", async (int id) =>
{
    try
    {
        // Route constraint ensures only integer ids reach this handler.
        await using var conn = await OpenConnectionWithRetry(dbConfig);
        await using var cmd = new MySqlCommand("DELETE FROM table1 WHERE task_id = @id", conn);
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();

        return Results.Ok(new { message = "Deleted" });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message, statusCode: 500);
    }
});

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");

static async Task<string> ExtractName(HttpRequest request)
{
    // Browser form submit.
    if (request.HasFormContentType)
    {
        var form = await request.ReadFormAsync();
        return form.TryGetValue("name", out var nameFromForm) ? nameFromForm.ToString() : string.Empty;
    }

    // API client JSON submit.
    if ((request.ContentType ?? string.Empty).Contains("application/json", StringComparison.OrdinalIgnoreCase))
    {
        var body = await request.ReadFromJsonAsync<ButtonNameBody>();
        return body?.name ?? string.Empty;
    }

    return string.Empty;
}

static async Task EnsureDatabaseIsReachable(DbConfig cfg)
{
    // Simple deterministic startup check query.
    await using var conn = await OpenConnectionWithRetry(cfg);
    await using var cmd = new MySqlCommand("SELECT 1 + 1 AS solution", conn);
    var result = Convert.ToInt32(await cmd.ExecuteScalarAsync());
    if (result != 2)
    {
        throw new InvalidOperationException("Database connected but check query failed");
    }
}

static async Task<MySqlConnection> OpenConnectionWithRetry(DbConfig cfg)
{
    var cs = new MySqlConnectionStringBuilder
    {
        Server = cfg.Host,
        UserID = cfg.User,
        Password = cfg.Password,
        Database = cfg.Database,
        Port = (uint)cfg.Port,
        AllowUserVariables = true
    }.ConnectionString;

    Exception? lastException = null;
    // Retry loop handles DB startup race in docker-compose.
    for (var i = 1; i <= 10; i++)
    {
        try
        {
            var conn = new MySqlConnection(cs);
            await conn.OpenAsync();
            return conn;
        }
        catch (Exception ex)
        {
            lastException = ex;
            await Task.Delay(TimeSpan.FromSeconds(5));
        }
    }

    throw new InvalidOperationException("Could not connect to database after retries", lastException);
}

record DbConfig(string Host, string User, string Password, string Database, int Port);
record ClientPostBody(string? post_content);
record ButtonNameBody(string? name);
record DatabaseInsertBody(string? title, string? description);
record DatabaseEntry(int task_id, string title, string description, DateTime created_at);
