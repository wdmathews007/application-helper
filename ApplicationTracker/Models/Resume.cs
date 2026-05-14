namespace ApplicationTracker.Models;

public class Resume
{
    public int Id { get; set; }
    public required string Name { get; set; } // e.g., "Full Stack Resume 2026", "Backend Focus"
    public string? FileUrl { get; set; } // Optional: link to where the PDF is stored
    public DateTime DateUploaded { get; set; } = DateTime.UtcNow;

    // Navigation property: One resume can be used for many applications
    public List<Application> Applications { get; set; } = new();
}