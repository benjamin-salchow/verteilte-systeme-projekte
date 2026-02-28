using System.IO;
using Xunit;

namespace CsharpClientServerWithDatabase.Tests;

public class ProgramSmokeTests
{
    private static string ResolveProgramPath()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null)
        {
            var candidate = Path.Combine(dir.FullName, "Program.cs");
            if (File.Exists(candidate))
            {
                return candidate;
            }
            var serverCandidate = Path.Combine(dir.FullName, "server", "Program.cs");
            if (File.Exists(serverCandidate))
            {
                return serverCandidate;
            }
            dir = dir.Parent;
        }

        throw new FileNotFoundException("Program.cs not found");
    }

    [Fact]
    public void ProgramDefinesCoreRoutes()
    {
        var programSource = File.ReadAllText(ResolveProgramPath());

        Assert.Contains("app.MapGet(\"/\"", programSource);
        Assert.Contains("app.MapPost(\"/client_post\"", programSource);
        Assert.Contains("app.MapGet(\"/database\"", programSource);
        Assert.Contains("app.MapDelete(\"/database/{id:int}\"", programSource);
    }
}
