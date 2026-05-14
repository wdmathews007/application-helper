Option 2 — Job Application Tracker
What it is: ASP.NET Core API that manages job applications, statuses, contacts, and follow up dates. You're literally using this workflow right now so you understand the domain deeply.
Business reason: "Developed a job application management API that consolidated tracking across 15+ active applications, reducing status lookup time and follow up management overhead."
Why it works: You can speak to every product decision authentically because you're the user. Interviewers respond well to candidates who built something to solve their own real problem. The irony of building a job tracker while job searching is also genuinely memorable.

Tech buzzwords im trying to meet:
.NET, C#, SQL
Cloud (Azure, AWS, GCP), Git, Agile, RESTful API, CI/CD
Front End (javascript, HTML, CSS)
ASP.NET
Nice to Have: DevOps, RabbitMQ, Cross-Functional

## Implementation Checklist

### Phase 1: Core API (MVP) - [C#, .NET, ASP.NET, RESTful API, Git, SQL]
- [x] Initialize ASP.NET Core Web API project
- [x] Define `Application` and `Interaction` data models
- [ ] Create RESTful `ApplicationsController` endpoints (GET, POST, PUT, DELETE)
- [ ] Set up Entity Framework Core for data access
- [ ] Create EF Core migrations and connect to a local SQL database
- [ ] Push source code to GitHub (Start using GitHub Issues for Agile tracking)

### Phase 2: Full-Stack & Cloud - [Front End, Cloud (Azure)]
- [ ] Build a simple frontend dashboard (HTML, CSS, Vanilla JS)
- [ ] Connect frontend to the ASP.NET Core API (Configure CORS)
- [ ] Provision Azure App Service and Azure SQL Database
- [ ] Deploy API and Database to Azure

### Phase 3: DevOps & Automation - [CI/CD, DevOps, RabbitMQ]
- [ ] Create a GitHub Actions workflow to build and test code on push (CI)
- [ ] Expand GitHub Actions to automatically deploy to Azure on merge to main (CD)
- [ ] Implement RabbitMQ queue for asynchronous job description web scraping
- [ ] Create a scheduled worker (Azure Function) for follow-up reminders