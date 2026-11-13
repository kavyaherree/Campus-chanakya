# Last Code Snapshot

## Recent Code Updates

### Date: 2026-10-24

#### 1. Frontend Client Dynamic API Configuration (`frontend/src/api/client.js`)
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

#### 2. Persistent Disk-Backed Database Configuration (`backend/src/main/resources/application.properties` & `.env`)
```properties
server.port=${SERVER_PORT:8080}
# Persistent file-backed H2 engine storing database across restarts
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:h2:file:./data/campus_chanakya;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE;CASE_INSENSITIVE_IDENTIFIERS=TRUE}
spring.datasource.driverClassName=${SPRING_DATASOURCE_DRIVER_CLASS_NAME:org.h2.Driver}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:sa}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:}
campuschanakya.jwt.secret=${CAMPUSCHANAKYA_JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
campuschanakya.jwt.expiration-ms=${CAMPUSCHANAKYA_JWT_EXPIRATION_MS:86400000}
```

#### 3. Automatic .env Loader (`backend/src/main/java/com/campuschanakya/CampusChanakyaApplication.java`)
```java
private static void loadEnvironmentProperties() {
    File[] candidatePaths = new File[] { new File(".env"), new File("../.env"), new File("../../.env") };
    // Parses non-comment KEY=VAL lines and sets System.setProperty(key, val)
    // Automatically cleans spaces from 16-character Gmail App Passwords
}
```

#### 4. Live SMTP & Gemini Environment Configuration (`.env`)
Configured live credentials:
- `GOOGLE_API_KEY1`, `GOOGLE_API_KEY2`, `GOOGLE_API_KEY3`
- `SMTP_EMAIL`, `SMTP_PASSWORD` (`qqvdtkmosajtofnu`)
- `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`
- `spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com` in `application.properties`
- Sanitized `.env.example` with generic placeholders to prevent Git secret exposure.

#### 5. Gemini AI Viva Service & Controller (`backend/src/main/java/com/campuschanakya/...`)
- [GeminiAiService.java](file:///c:/Users/dell/Desktop/CampusChankya/backend/src/main/java/com/campuschanakya/service/GeminiAiService.java) & [GeminiAiServiceImpl.java](file:///c:/Users/dell/Desktop/CampusChankya/backend/src/main/java/com/campuschanakya/service/impl/GeminiAiServiceImpl.java): Multi-key rate-limit rotation calling Gemini 2.0 Flash with local invariant rubric failover.
- [AiInterviewController.java](file:///c:/Users/dell/Desktop/CampusChankya/backend/src/main/java/com/campuschanakya/controller/AiInterviewController.java): REST endpoints on `/api/ai/viva/generate` and `/api/ai/viva/evaluate`.

#### 6. VidyaSetu-Style Student Dashboard (`frontend/src/pages/StudentDashboard.jsx`)
- Complete sidebar architecture with 10 interactive modules.
- Built-in Gemini AI Viva simulator and client-side ATS Resume Scanner tool.
