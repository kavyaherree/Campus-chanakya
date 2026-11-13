# Master To-Do List

## 1. High Priority (Active Sprint)
- [x] Standardize environment configurations (`.env`, `.env.example`) across root, backend, and frontend.
- [x] Update frontend API client to dynamically read `VITE_API_BASE_URL`.
- [x] Update `application.properties` to cleanly map to environment variables with default values.
- [x] Establish `Instruction.md` and `Project_Memory` documentation system.
- [ ] Implement live Gemini / OpenAI client for dynamic AI Redemption roadmap generation.
- [ ] Connect SMTP mail delivery for real email notifications and verification.

## 2. Backend Enhancements (Spring Boot 3)
- [ ] Add rate limiting filter for `/api/auth/login` and `/api/auth/register`.
- [ ] Enhance evaluation exceptions with custom global `@RestControllerAdvice` error responses.
- [ ] Add integration test suite for `EvaluatorFactory` and concrete `SkillEvaluator` strategies.
- [ ] Add Dockerfile and `docker-compose.yml` for containerized backend + MySQL deployment.

## 3. Frontend Enhancements (React 18 + Vite)
- [ ] Add visual toast alerts for assessment submissions and strike warnings.
- [ ] Enhance ATS candidate ranking visualizations on recruiter dashboard.
- [ ] Implement full-screen lock and webcam proctoring widget on active assessments.
- [ ] Add dark mode toggle persisted in local storage.

## 4. Academic Viva Preparation
- [ ] Prepare OOP viva checklist covering Encapsulation, Inheritance, Polymorphism, and Abstraction.
- [ ] Verify test database seeders initialize demo accounts for Student, Alumni, Recruiter, and Admin.
