using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ApplicationTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FilesController : ControllerBase
{
    private readonly string _uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

    public FilesController()
    {
        if (!Directory.Exists(_uploadsFolder))
        {
            Directory.CreateDirectory(_uploadsFolder);
        }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(_uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return the path for the frontend to save
        return Ok(new { url = $"/api/files/download/{uniqueFileName}", originalName = file.FileName });
    }

    [HttpGet("download/{fileName}")]
    [AllowAnonymous] // Allows standard <a href> links to view/download without attaching the JWT
    public IActionResult DownloadFile(string fileName)
    {
        var filePath = Path.Combine(_uploadsFolder, fileName);
        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(filePath, out string contentType))
        {
            contentType = "application/octet-stream";
        }

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        
        // Serve PDFs inline for viewing, force download for everything else (like DOCX)
        if (contentType == "application/pdf") return File(stream, contentType);

        return File(stream, contentType, fileName);
    }
}