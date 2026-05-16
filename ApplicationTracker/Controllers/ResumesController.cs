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
public class ResumesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ResumesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Resume>>> GetResumes()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Ok(await _context.Resumes.Where(r => r.UserId == userId).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Resume>> GetResume(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (resume == null)
        {
            return NotFound(); 
        }

        return Ok(resume);
    }

    [HttpPost]
    public async Task<ActionResult<Resume>> CreateResume(Resume resume)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        resume.UserId = userId;

        _context.Resumes.Add(resume);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetResume), new { id = resume.Id }, resume);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Resume>> UpdateResume(int id, Resume resume)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var existingResume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (existingResume == null)
        {
            return NotFound();
        }

        existingResume.Name = resume.Name;
        existingResume.FileUrl = resume.FileUrl;

        await _context.SaveChangesAsync();

        return Ok(existingResume); 
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteResume(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (resume == null)
        {
            return NotFound();
        }

        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();
        return NoContent(); 
    }
}