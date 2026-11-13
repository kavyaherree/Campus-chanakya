# CampusChanakya 🏛️
### End-to-End Verified Skill Assessment, AI Redemption, Alumni Mentorship & Campus Placement Engine

> **Primary Academic Subject**: Object-Oriented Programming with Java (OOPJ)  
> **Backend Architecture**: Java 17+, Spring Boot 3, Spring Security 6 (Stateless JWT), Spring Data JPA, MySQL  
> **Frontend Architecture**: React 18, Vite, Tailwind CSS, Axios, React Router Dom, Lucide-react  

---

## 1. Academic & Viva Demonstration Guide (OOPJ Pillars)

This codebase has been architected to serve as a reference implementation for an academic viva panel, explicitly exhibiting the **Four Pillars of OOP** and **SOLID Design Principles**:

| OOP Pillar | Codebase Implementation | Academic Viva Talking Point |
| :--- | :--- | :--- |
| **Encapsulation** | `User.java`, `StudentProfile.java`, `Assessment.java`, DTOs | Strict `private` fields with validated getters and setters. Invariants like CGPA bounds (`0.0 - 10.0`) and passing cutoffs are strictly guarded against illegal state corruption. |
| **Inheritance** | `BaseEntity.java` (`@MappedSuperclass`) | Child domain entities inherit universal identity (`id`) and JPA auditing timestamps (`createdAt`, `updatedAt`) without redundant database schema duplication. |
| **Polymorphism** | `SkillEvaluator.java`, `McqEvaluator.java`, `CodeEvaluator.java` | **Strategy Pattern**: The caller invokes `evaluate(...)` polymorphically at runtime. Java dynamic method dispatch (JVM vtable) routes execution to the correct concrete algorithm. |
| **Abstraction** | `EvaluatorFactory.java`, `AuthService`, `JobService` | Service contracts decouple high-level business workflows from low-level relational or evaluation mechanics. `EvaluatorFactory` resolves implementations cleanly. |

---

## 2. Monorepo Structure

```text
CampusChankya/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/campuschanakya/
│       │   │   ├── CampusChanakyaApplication.java
│       │   │   ├── model/           # BaseEntity, User, StudentProfile, Skill, Assessment, etc.
│       │   │   ├── evaluator/       # SkillEvaluator (Strategy), McqEvaluator, CodeEvaluator, Factory
│       │   │   ├── service/         # Abstract Service contracts
│       │   │   │   └── impl/        # Encapsulated Business Service implementations
│       │   │   ├── repository/      # Spring Data JPA repositories
│       │   │   ├── dto/             # Encapsulated Data Transfer Objects
│       │   │   ├── controller/      # REST API Controllers (Auth, Assessment, Job, etc.)
│       │   │   └── config/          # Spring Security 6, JWT Filter, CORS
│       │   └── resources/
│       │       └── application.properties # MySQL, JPA & JWT configuration
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── api/client.js            # Axios with Bearer JWT interceptor
        ├── context/AuthContext.jsx  # Role, token, and session provider
        ├── components/              # Navbar, ProtectedRoute, Card
        ├── pages/                   # Login, Student, Assessment (Proctored), Redemption, Alumni, Recruiter, Admin
        ├── App.jsx                  # React Router with role guards
        ├── main.jsx
        └── index.css
```

---

## 3. Step-by-Step Execution Instructions

### A. Database Setup (MySQL)
Ensure your local MySQL service is running, then execute in MySQL Workbench or CLI:
```sql
CREATE DATABASE IF NOT EXISTS campus_chanakya;
```
*(Default user credentials configured in `application.properties`: username `root`, password `root`. Update if your local MySQL uses different credentials).*

### B. Run Backend (Spring Boot 3)
```powershell
cd backend
mvn clean spring-boot:run
```
- API will start on: `http://localhost:8080`
- Database tables and initial foundational skills will automatically be seeded by Hibernate JPA and `@PostConstruct`.

### C. Run Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run dev
```
- Web Application will be live at: `http://localhost:5173`

---

## 4. Default Seeded Roles for Testing

| Role | Available Features |
| :--- | :--- |
| **STUDENT** | Proctored skill tests with anti-cheating strike logging, AI 3-day recovery roadmaps, real-time ATS match scoring and job applications. |
| **ALUMNI** | Industry micro/macro project creation and student PR mentorship review queues. |
| **RECRUITER**| Placement vacancy posting with minimum CGPA cutoffs and ranked ATS candidate screening. |
| **ADMIN** | Institutional statistics, integrity audit logs, and viva evaluation checklist. |
