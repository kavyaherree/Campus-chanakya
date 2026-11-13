# Permanent Architectural Changes

This file logs permanent architectural choices and conventions that must not be reverted.

---

## 1. Zero-Config Database Dual-Mode
- **Convention:** The backend must run out of the box using embedded in-memory H2 with MySQL compatibility mode enabled.
- **Rule:** Do not remove H2 runtime dependency or force hard external MySQL connections in default profiles. External MySQL is toggled via environment variables in `.env`.

---

## 2. OOP Strategy Pattern for Evaluation
- **Convention:** Skill evaluation must remain polymorphic through the `SkillEvaluator` interface and `EvaluatorFactory`.
- **Rule:** Do not replace dynamic polymorphism with chained `if/else` or `switch` blocks inside service layers.

---

## 3. Strict Stateless JWT Authentication
- **Convention:** No server-side HTTP session state (`SessionCreationPolicy.STATELESS`).
- **Rule:** All authenticated requests must pass Bearer tokens in the `Authorization` header.

---

## 4. Protected Environment Secrets
- **Convention:** Real keys, passwords, and tokens must never be hardcoded into source files or tracked in git.
- **Rule:** Always use `.env` with blanks in `.env.example` and keep `.gitignore` updated.
