using ApplicationTracker.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    // This is a temporary in-memory list for testing.
    // We will replace this with a real SQL database later.
    private static readonly List<Application> _applications = new()
    {
        new Application
        {
            Id = 1,
            CompanyName = "Tech Solutions Inc.",
            Role = "Software Engineer",
            DateApplied = DateTime.UtcNow.AddDays(-10)
        }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Application>> GetApplications()
    {
        return Ok(_applications);
    }
}