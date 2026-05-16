namespace ApplicationTracker.Models;

public class Application
{
    public int Id { get; set; }
    public required string CompanyName { get; set; }
    public required string Role { get; set; }
    public string Status { get; set; } = "Applied"; // Default status
    public DateTime DateApplied { get; set; }
    public string? JobDescriptionUrl { get; set; }
    public DateTime? FollowUpDate { get; set; }

    // Foreign Key linking to the Resume used
    public int? ResumeId { get; set; }
    public Resume? Resume { get; set; }

    // Navigation property: An application can have many interactions
    public List<Interaction> Interactions { get; set; } = new();

    public string? UserId { get; set; }
}