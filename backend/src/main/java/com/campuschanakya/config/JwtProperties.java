package com.campuschanakya.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * ============================================================================
 * JWT CONFIGURATION PROPERTIES
 * ============================================================================
 * Type-safe configuration properties for campuschanakya.jwt namespace.
 */
@Configuration
@ConfigurationProperties(prefix = "campuschanakya.jwt")
@Getter
@Setter
public class JwtProperties {

    /**
     * 256-bit base64-encoded secret key for signing HMAC-SHA256 JWT tokens.
     */
    private String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    /**
     * JWT authentication token expiration duration in milliseconds (default 24h).
     */
    private long expirationMs = 86400000L;
}
