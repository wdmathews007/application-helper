using ApplicationTracker.Models;
using ApplicationTracker.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApplicationTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
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
        return Ok(await _context.Resumes.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Resume>> GetResume(int id)
    {
        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == id);

        if (resume == null)
        {
            return NotFound(); 
        }

        return Ok(resume);
    }

    [HttpPost]
    public async Task<ActionResult<Resume>> CreateResume(Resume resume)
    {
        _context.Resumes.Add(resume);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetResume), new { id = resume.Id }, resume);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Resume>> UpdateResume(int id, Resume resume)
    {
        var existingResume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == id);

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
        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == id);

        if (resume == null)
        {
            return NotFound();
        }

        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();
        return NoContent(); 
    }
}