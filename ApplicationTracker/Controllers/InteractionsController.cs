using ApplicationTracker.Models;
using ApplicationTracker.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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
        return Ok(await _context.Interactions.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Interaction>> GetInteraction(int id)
    {
        var interaction = await _context.Interactions.FirstOrDefaultAsync(i => i.Id == id);

        if (interaction == null)
        {
            return NotFound();
        }

        return Ok(interaction);
    }

    [HttpPost]
    public async Task<ActionResult<Interaction>> CreateInteraction(Interaction interaction)
    {
        _context.Interactions.Add(interaction);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInteraction), new { id = interaction.Id }, interaction);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Interaction>> UpdateInteraction(int id, Interaction interaction)
    {
        var existingInteraction = await _context.Interactions.FirstOrDefaultAsync(i => i.Id == id);

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
        var interaction = await _context.Interactions.FirstOrDefaultAsync(i => i.Id == id);

        if (interaction == null)
        {
            return NotFound();
        }

        _context.Interactions.Remove(interaction);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}