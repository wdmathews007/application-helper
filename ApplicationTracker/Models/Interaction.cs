namespace ApplicationTracker.Models;

public class Interaction
{
    public int Id { get; set; }
    public DateTime InteractionDate { get; set; }
    public required string Type { get; set; } // e.g., "Phone Screen", "Email", "Technical Interview"
    public string? Notes { get; set; }

    // Foreign Key to link back to the Application
    public int ApplicationId { get; set; }
}