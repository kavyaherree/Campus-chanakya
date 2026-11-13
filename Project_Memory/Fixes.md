# Applied Fixes Log

## Record of Critical Fixes

### Fix #001: Environment Variable Support for Frontend API Client
- **Date:** 2026-10-24
- **Component:** `frontend/src/api/client.js`
- **Issue:** Hardcoded `http://localhost:8080/api` URL prevented cross-environment deployment.
- **Resolution:** Updated to `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'`.

### Fix #002: Dynamic Spring Boot Property Binding
- **Date:** 2026-10-24
- **Component:** `backend/src/main/resources/application.properties`
- **Issue:** Static configuration prevented runtime environment variable overrides.
- **Resolution:** Replaced with Spring property expressions `${VAR:default}`.

### Fix #003: Resolution of QuestionRepository MySQL Grammar Error
- **Date:** 2026-10-24
- **Component:** `backend/src/main/java/com/campuschanakya/repository/QuestionRepository.java`
- **Issue:** `LIMIT :limit` in native query produced SQL parser failure.
- **Resolution:** Refactored query to use Spring Data `Pageable` parameter and eliminated redundant `@Repository`.

### Fix #004: Cleaned Unnecessary @Repository Annotations
- **Date:** 2026-10-24
- **Components:** All 9 Spring Data JPA repository interfaces.
- **Issue:** Redundant `@Repository` annotations flagged across all repositories.
- **Resolution:** Removed redundant `@Repository` annotations and unused imports.

### Fix #005: Addressed Null Pointer Risks in OtpServiceImpl & SecurityConfig
- **Date:** 2026-10-24
- **Components:** `OtpServiceImpl.java`, `SecurityConfig.java`
- **Issue:** `otp.trim()` invoked without null verification; method reference in `http.csrf(...)` triggered type safety warning.
- **Resolution:** Added defensive null checks in `OtpServiceImpl.java` and switched CSRF config to lambda `csrf -> csrf.disable()`.

### Fix #006: Type-Safe JwtProperties & Annotation Processor for Unknown Properties
- **Date:** 2026-10-24
- **Components:** `JwtProperties.java`, `pom.xml`, `application.properties`
- **Issue:** `campuschanakya.jwt.secret` and `expiration-ms` were flagged as unknown configuration properties.
- **Resolution:** Implemented `JwtProperties` annotated with `@ConfigurationProperties(prefix = "campuschanakya.jwt")` and added `spring-configuration-metadata.json`.

### Fix #007: Standard CSS Background-Clip Compatibility
- **Date:** 2026-10-24
- **Component:** `frontend/src/index.css`
- **Issue:** Missing standard `background-clip: text` alongside `-webkit-background-clip`.
- **Resolution:** Added standard `background-clip: text;`.

### Fix #008: Spring Boot Latest Patch Upgrade (3.3.13) & Automatic Build Sync
- **Date:** 2026-10-24
- **Components:** `backend/pom.xml`, `.vscode/settings.json`
- **Issue:** Spring Boot version warnings and manual project configuration reload warnings.
- **Resolution:** Upgraded to Spring Boot `3.3.13` and enabled automatic build sync.

### Fix #009: VMware Spring Boot Language Server Diagnostic Configuration
- **Date:** 2026-10-24
- **Component:** `.vscode/settings.json`
- **Issue:** VMware Spring Boot LSP (v2.4.1) emitted lifecycle support warnings.
- **Resolution:** Configured exact LSP diagnostic rules in `.vscode/settings.json`.

### Fix #010: Real Email OTP Delivery & Interactive Verification UI
- **Date:** 2026-10-24
- **Components:** `AuthController.java`, `AuthServiceImpl.java`, `EmailServiceImpl.java`, `application.properties`, `Login.jsx`, `auth.css`
- **Issue:** OTP was previously leaked in the API JSON response and auto-populated into input fields.
- **Resolution:** 
  1. Updated `AuthController` to dispatch OTP to destination inbox without leaking the raw code in JSON.
  2. Mapped `application.properties` mail configurations to bind to both `SPRING_MAIL_*` and `SMTP_*` environment variables.
  3. Implemented interactive 6-digit segmented input, countdown timer with resend trigger, and email lock upon successful verification in `Login.jsx`.
  4. Added `/api/auth/login-otp` for passwordless email OTP sign-in.

### Fix #011: Simplified Sign In Form & Password-Only Entry
- **Date:** 2026-10-24
- **Components:** `frontend/src/pages/Login.jsx`
- **Issue:** Sign In previously contained dual mode tabs for password and passwordless OTP login, causing unnecessary visual complexity.
- **Resolution:**
  1. Removed OTP login tabs from the Sign In view; Sign In now strictly consists of Email and Password inputs with a "Forgot password?" recovery trigger.
  2. Maintained OTP verification in the "Forgot password?" view: users enter their registered email, receive a real 6-digit code, and enter it to set their new password.
  3. Maintained full email OTP verification in Sign Up prior to account registration.

