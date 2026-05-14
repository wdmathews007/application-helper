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

    // GET: api/Applications/5
    [HttpGet("{id}")]
    public ActionResult<Application> GetApplication(int id)
    {
        var application = _applications.FirstOrDefault(a => a.Id == id);

        if (application == null)
        {
            return NotFound(); // Returns a 404 Not Found response
        }

        return Ok(application); // Returns a 200 OK response with the item
    }

    [HttpPost]
    public ActionResult<Application> CreateApplication(Application application)
    {
        application.Id = _applications.Count > 0 ? _applications.Max(a => a.Id) + 1 : 1;
        _applications.Add(application);
        return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
    }

    [HttpPut("{id}")]
    public ActionResult<Application> UpdateApplication(int id, Application application)
    {
        var existingApplication = _applications.FirstOrDefault(a => a.Id == id);

        if (existingApplication == null)
        {
            return NotFound(); // Returns a 404 Not Found response
        }

        // Update the existing application with new values
        existingApplication.CompanyName = application.CompanyName;
        existingApplication.Role = application.Role;
        existingApplication.Status = application.Status;
        existingApplication.DateApplied = application.DateApplied;
        existingApplication.JobDescriptionUrl = application.JobDescriptionUrl;
        existingApplication.FollowUpDate = application.FollowUpDate;

        return Ok(existingApplication); // Returns a 200 OK response with the updated item
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteApplication(int id)
    {
        var application = _applications.FirstOrDefault(a => a.Id == id);

        if (application == null)
        {
            return NotFound(); // Returns a 404 Not Found response
        }

        _applications.Remove(application);
        return NoContent(); // Returns a 204 No Content response
    }
}