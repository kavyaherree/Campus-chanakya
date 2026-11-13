# Backend Loopholes and Fixes

This document records potential architectural loopholes, edge cases, and their corresponding security/design fixes in the Spring Boot backend.

---

## 1. CORS Configuration
- **Potential Loophole:** Wildcard CORS (`*`) allows arbitrary origins to invoke authenticated APIs when credentials are transmitted.
- **Fix Applied:** Configured explicit allowed origins in `WebConfig.java` / `application.properties` pointing to `http://localhost:5173`, `http://127.0.0.1:5173`, and production domains with `allowCredentials(true)`.

---

## 2. JWT Secret Entropy & Storage
- **Potential Loophole:** Weak or hardcoded JWT secrets can be brute-forced to forge valid student or admin authentication tokens.
- **Fix Applied:** Configured high-entropy 256-bit base64-encoded HMAC-SHA256 secret in `.env` with fallback bound to `${CAMPUSCHANAKYA_JWT_SECRET}`.

---

## 3. Defensive CGPA and Grade Bounds
- **Potential Loophole:** Corrupted requests submitting negative CGPA or values exceeding 10.0 corrupting student ranking.
- **Fix Applied:** Encapsulated validation in `StudentProfile.java` with `@Min(0.0)` and `@Max(10.0)` annotations and defensive setter constraints.

---

## 4. Assessment Cheating Prevention
- **Potential Loophole:** Client-side test answer tampering or replaying expired attempts.
- **Fix Applied:** 
  - Answers are strictly scored server-side using the `SkillEvaluator` Strategy pattern.
  - Strikes are persisted to the database and invalidate assessments exceeding the violation threshold.
