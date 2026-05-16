using ApplicationTracker.Models;
using ApplicationTracker.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ApplicationTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ApplicationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Ok(await _context.Applications.Where(a => a.UserId == userId).ToListAsync());
    }

    // GET: api/Applications/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Application>> GetApplication(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var application = await _context.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application == null)
        {
            return NotFound(); // Returns a 404 Not Found response
        }

        return Ok(application); // Returns a 200 OK response with the item
    }

    [HttpPost]
    public async Task<ActionResult<Application>> CreateApplication(Application application)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        application.UserId = userId;

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        var interaction = new Interaction
        {
            ApplicationId = application.Id,
            InteractionDate = application.DateApplied,
            Type = "Applied",
            Notes = "Initial application submitted.",
            UserId = userId
        };
        _context.Interactions.Add(interaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Application>> UpdateApplication(int id, Application application)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var existingApplication = await _context.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

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
        existingApplication.ResumeId = application.ResumeId;

        await _context.SaveChangesAsync();

        return Ok(existingApplication); // Returns a 200 OK response with the updated item
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApplication(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var application = await _context.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application == null)
        {
            return NotFound(); // Returns a 404 Not Found response
        }

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync();
        return NoContent(); // Returns a 204 No Content response
    }
}