package com.campuschanakya.service.impl;

import com.campuschanakya.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * ============================================================================
 * EMAIL SERVICE IMPLEMENTATION
 * ============================================================================
 * Handles transmission of HTML verification emails via Brevo HTTPS API (Port 443)
 * for Render Cloud compatibility, with fallback to JavaMailSender over SMTP.
 */
@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${spring.mail.username:${SMTP_EMAIL:}}")
    private String fromEmail;

    @Value("${spring.mail.password:${SMTP_PASSWORD:}}")
    private String smtpPassword;

    @Value("${smtp.from.name:${SMTP_FROM_NAME:CampusChanakya}}")
    private String fromName;

    public EmailServiceImpl(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        String actionTitle;
        String actionDescription;

        if ("FORGOT_PASSWORD".equalsIgnoreCase(purpose)) {
            actionTitle = "Password Reset Request";
            actionDescription = "We received a request to reset your password for your CampusChanakya account. Enter the verification code below to proceed:";
        } else if ("LOGIN".equalsIgnoreCase(purpose)) {
            actionTitle = "One-Time Login Code";
            actionDescription = "Enter the verification code below to securely sign in to your CampusChanakya account:";
        } else {
            actionTitle = "Email Verification Code";
            actionDescription = "Thank you for registering on CampusChanakya. Enter the verification code below to confirm your email address and activate your account:";
        }

        log.info("Attempting to dispatch verification email to: {} for [{}]", toEmail, purpose);

        String senderDisplayName = (fromName != null && !fromName.isBlank()) ? fromName.trim() : "CampusChanakya";
        String senderAddress = (fromEmail != null && !fromEmail.isBlank()) ? fromEmail.trim() : "kavyakhurana70@gmail.com";
        String subject = "Your CampusChanakya Verification Code: " + otpCode;

        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>%s</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
                <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 15px;">
                    <tr>
                        <td align="center">
                            <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 30px 35px 20px 35px; border-bottom: 1px solid #f1f5f9;">
                                        <div style="display: inline-block; background-color: #ecfdf5; color: #059669; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
                                            CampusChanakya 🏛️
                                        </div>
                                        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 16px 0 6px 0;">%s</h1>
                                        <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;">%s</p>
                                    </td>
                                </tr>

                                <!-- OTP Code Box -->
                                <tr>
                                    <td align="center" style="padding: 30px 35px;">
                                        <div style="background-color: #f8fafc; border: 2px dashed #059669; border-radius: 12px; padding: 20px; text-align: center;">
                                            <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px;">Your 6-Digit Code</span>
                                            <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #059669; font-family: monospace;">%s</span>
                                        </div>
                                        <p style="font-size: 12px; color: #64748b; margin-top: 15px; margin-bottom: 0;">
                                            ⏱️ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 35px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.4;">
                                        If you did not request this email, please ignore it or contact your institutional administrator.<br/>
                                        CampusChanakya · Placement, Verification & Assessment Engine
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(actionTitle, actionTitle, actionDescription, otpCode);

        // 1. Check for Brevo API Key first (bypasses Render Free Tier port 587 block)
        String apiKey = (smtpPassword != null && !smtpPassword.isBlank())
                ? smtpPassword.trim()
                : System.getenv("SMTP_PASSWORD");

        if (apiKey != null && apiKey.startsWith("xkeysib-")) {
            try {
                Map<String, Object> payload = Map.of(
                        "sender", Map.of("name", senderDisplayName, "email", senderAddress),
                        "to", List.of(Map.of("email", toEmail.trim())),
                        "subject", subject,
                        "htmlContent", htmlBody
                );

                String jsonPayload = objectMapper.writeValueAsString(payload);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                        .header("accept", "application/json")
                        .header("api-key", apiKey)
                        .header("content-type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    log.info("✅ Verification email successfully delivered via Brevo HTTPS API to {}", toEmail);
                    return;
                } else {
                    log.error("❌ Brevo HTTPS API error (HTTP {}): {}", response.statusCode(), response.body());
                }
            } catch (Exception e) {
                log.error("❌ Failed to send verification email via Brevo HTTPS API: {}", e.getMessage());
            }
        }

        // 2. Fallback to standard JavaMailSender SMTP (for local development)
        if (mailSender == null || fromEmail == null || fromEmail.isBlank()) {
            log.warn("SMTP credentials not fully configured in application.properties or .env (spring.mail.username / SMTP_EMAIL / SMTP_PASSWORD).");
            log.info("[LOCAL DEV FALLBACK] Recipient: {} | Generated Code: {} | Purpose: {}", toEmail, otpCode, purpose);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new jakarta.mail.internet.InternetAddress(senderAddress, senderDisplayName, "UTF-8"));
            helper.setReplyTo(new jakarta.mail.internet.InternetAddress(senderAddress, senderDisplayName, "UTF-8"));
            helper.setTo(toEmail.trim());
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("✅ Verification email successfully delivered via SMTP to {}", toEmail);

        } catch (Exception e) {
            log.error("❌ Failed to send verification email to {} via SMTP: {}", toEmail, e.getMessage());
            log.warn("👉 Please verify spring.mail.username and spring.mail.password in application.properties or environment variables.");
        }
    }
}
