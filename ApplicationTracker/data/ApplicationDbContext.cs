using ApplicationTracker.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ApplicationTracker.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // These properties represent the tables that will be created in your database
    public DbSet<Application> Applications { get; set; }
    public DbSet<Interaction> Interactions { get; set; }
    public DbSet<Resume> Resumes { get; set; }
}