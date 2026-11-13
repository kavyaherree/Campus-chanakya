# CampusChanakya - Project Memory & Description

## 1. Executive Overview
CampusChanakya is an enterprise-grade Verified Skill Assessment, AI Redemption, Alumni Mentorship, and Campus Placement Engine. The platform is architected specifically around Object-Oriented Programming with Java (OOPJ) and SOLID design principles, paired with a React 18, Vite, and Tailwind CSS frontend.

---

## 2. Core Architecture & Tech Stack

### Backend Architecture
- **Language & Runtime:** Java 17+ / OpenJDK
- **Framework:** Spring Boot 3.2.4
- **Security & Auth:** Spring Security 6 with stateless HMAC-SHA256 JJWT (0.12.5) tokens
- **Persistence & ORM:** Spring Data JPA / Hibernate with automated schema creation/updates
- **Database Engine:**
  - In-Memory H2 Database in MySQL compatibility mode (zero-config local runtime)
  - Production-ready external MySQL 8.x support via JDBC
- **Mail & Dispatch:** Spring Boot Starter Mail with SMTP TLS connection pooling
- **Architecture Highlights (OOP Pillars):**
  - Encapsulation: Strict private fields, validated getters/setters, defensive validation.
  - Inheritance: BaseEntity mapped superclass providing universal identity and audit timestamps.
  - Polymorphism: SkillEvaluator Strategy pattern dynamically routing between McqEvaluator and CodeEvaluator.
  - Abstraction: Clean interface contracts decoupling controllers, services, and evaluator factories.

### Frontend Architecture
- **Framework:** React 18 with Vite
- **Styling:** Vanilla Tailwind CSS with custom theme variables
- **Icons:** Lucide React
- **Routing:** React Router DOM (v6) with role-guarded routes
- **API Client:** Native fetch client in `frontend/src/api/client.js` with Bearer JWT interceptors and auto-logout on 401
- **State & Context:** `AuthContext.jsx` for user role, session persistence, and reactive auth guards

---

## 3. Platform Roles & Features

1. **Student Portal:**
   - Proctored skill assessments with anti-cheat strike tracking (fullscreen exits, tab switching).
   - Server-side polymorphic evaluation and instant pass/fail calculation.
   - AI Redemption: Automated 3-day recovery roadmaps when cutoff is missed.
   - Job Board with ATS resume matching scores.
   - Alumni project review submissions.

2. **Alumni Portal:**
   - Industry micro and macro project authoring.
   - Student project PR review queue, feedback, and verification.

3. **Recruiter Portal:**
   - Placement vacancy creation with cutoff criteria (CGPA, verified skill badges).
   - Applicant ranking and ATS match screening.

4. **Admin Portal:**
   - Campus integrity audit logs and cheating strike metrics.
   - Skill catalog and evaluator performance monitoring.
   - Viva evaluation checklist and compliance verification.

---

## 4. Monorepo Directory Layout
```text
CampusChankya/
├── .env                         # Full-stack environment configuration (credentials blanked)
├── .env.example                 # Environment variable template
├── Instruction.md               # AI Developer collaboration rules
├── Project_Memory/              # Project tracking and status memory
├── backend/                     # Spring Boot 3 application
│   ├── .env                     # Backend environment configuration
│   ├── .env.example             # Backend environment template
│   ├── pom.xml                  # Maven dependencies
│   └── src/main/
│       ├── java/com/campuschanakya/
│       │   ├── CampusChanakyaApplication.java
│       │   ├── config/          # Spring Security 6, JWT, CORS
│       │   ├── controller/      # REST API endpoints
│       │   ├── dto/             # Data transfer objects
│       │   ├── evaluator/       # Strategy pattern evaluators
│       │   ├── model/           # JPA entities
│       │   ├── repository/      # Spring Data JPA repositories
│       │   └── service/         # Business logic contracts and impl
│       └── resources/
│           └── application.properties # Spring configuration with env bindings
└── frontend/                    # React 18 + Vite frontend
    ├── .env                     # Vite frontend environment configuration
    ├── .env.example             # Vite frontend environment template
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/client.js        # API client with JWT interceptor
        ├── context/AuthContext.jsx
        ├── pages/               # Multi-role dashboard views
        └── App.jsx
```
