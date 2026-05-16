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
public class InteractionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public InteractionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Interaction>>> GetInteractions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Ok(await _context.Interactions.Where(i => i.UserId == userId).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Interaction>> GetInteraction(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var interaction = await _context.Interactions.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

        if (interaction == null)
        {
            return NotFound();
        }

        return Ok(interaction);
    }

    [HttpPost]
    public async Task<ActionResult<Interaction>> CreateInteraction(Interaction interaction)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        interaction.UserId = userId;

        _context.Interactions.Add(interaction);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInteraction), new { id = interaction.Id }, interaction);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Interaction>> UpdateInteraction(int id, Interaction interaction)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var existingInteraction = await _context.Interactions.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

        if (existingInteraction == null)
        {
            return NotFound();
        }

        existingInteraction.InteractionDate = interaction.InteractionDate;
        existingInteraction.Type = interaction.Type;
        existingInteraction.Notes = interaction.Notes;
        existingInteraction.ApplicationId = interaction.ApplicationId; // Allow moving the interaction to another app if needed

        await _context.SaveChangesAsync();

        return Ok(existingInteraction);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInteraction(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var interaction = await _context.Interactions.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

        if (interaction == null)
        {
            return NotFound();
        }

        _context.Interactions.Remove(interaction);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}