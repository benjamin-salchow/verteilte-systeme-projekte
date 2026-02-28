using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Hosting;
using Xunit;

namespace CsharpClientServerWithDatabase.Tests;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override IHost CreateHost(IHostBuilder builder)
    {
        // Skip database connection during tests
        builder.UseEnvironment("Testing");
        return base.CreateHost(builder);
    }
}

public class RouteTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly CustomWebApplicationFactory<Program> _factory;

    public RouteTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Root_RedirectsToStaticIndex()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Contains("/static/index.html", response.Headers.Location?.ToString());
    }

    [Fact]
    public async Task SpecialPath_ReturnsTextResponse()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/special_path");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("This is another path", content);
    }

    [Fact]
    public async Task ClientPost_WithValidBody_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/client_post", new { post_content = "hello" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<dynamic>();
        Assert.Equal("I got your message: hello", result?.message.ToString());
    }

    [Fact]
    public async Task ClientPost_WithMissingBody_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/client_post", new { });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<dynamic>();
        Assert.Contains("requires a body", result?.message.ToString());
    }

    [Fact]
    public async Task Button1Name_WithFormData_ReturnsSuccess()
    {
        var client = _factory.CreateClient();
        var formData = new MultipartFormDataContent();
        formData.Add(new StringContent("John"), "name");
        
        var response = await client.PostAsync("/button1_name", formData);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<dynamic>();
        Assert.Contains("Name is: John", result?.message.ToString());
    }

    [Fact]
    public async Task Button2_ReturnsRandomNumber()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/button2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("Antwort:", content);
    }

    [Fact]
    public async Task RequestInfo_ReturnsJsonWithHeaders()
    {
        var client = _factory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Get, "/request_info");
        request.Headers.Add("X-Test", "value");
        
        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("X-Test", content);
        Assert.Contains("request_info", content);
    }
}