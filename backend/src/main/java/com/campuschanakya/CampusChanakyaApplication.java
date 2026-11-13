package com.campuschanakya;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * ============================================================================
 * CampusChanakya - Academic & Placement Acceleration Engine
 * ============================================================================
 * Primary Academic Focus: Object-Oriented Programming with Java (OOPJ)
 * Demonstrating the 4 Pillars of OOP:
 * 1. Encapsulation: Strict private fields, validated mutators and immutable domain invariants.
 * 2. Inheritance: Polymorphic base entities (@MappedSuperclass BaseEntity).
 * 3. Polymorphism: Strategy evaluation patterns (SkillEvaluator -> McqEvaluator, CodeEvaluator).
 * 4. Abstraction: Clean service contracts decoupling implementation from HTTP protocols.
 */
@SpringBootApplication
@EnableJpaAuditing
public class CampusChanakyaApplication {

    public static void main(String[] args) {
        loadEnvironmentProperties();
        SpringApplication.run(CampusChanakyaApplication.class, args);
    }

    /**
     * Automatically loads .env configuration from workspace root into System properties
     * before Spring Application Context initializes.
     */
    private static void loadEnvironmentProperties() {
        File[] candidatePaths = new File[] {
                new File("../.env"),
                new File(".env"),
                new File("../../.env")
        };

        int loadedCount = 0;
        for (File envFile : candidatePaths) {
            if (!envFile.exists() || !envFile.isFile()) {
                continue;
            }
            System.out.println("[CampusChanakya] Inspecting environment file: " + envFile.getAbsolutePath());
            try (BufferedReader reader = new BufferedReader(new FileReader(envFile, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        String key = line.substring(0, eqIdx).trim();
                        String val = line.substring(eqIdx + 1).trim();

                        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.substring(1, val.length() - 1);
                        }

                        // Gmail 16-char app passwords should not have spaces when passed to SMTP
                        if (("SMTP_PASSWORD".equalsIgnoreCase(key) || "SPRING_MAIL_PASSWORD".equalsIgnoreCase(key)) && val.contains(" ")) {
                            val = val.replace(" ", "");
                        }

                        // Only set non-empty values into system properties
                        if (!val.isEmpty()) {
                            String existing = System.getProperty(key);
                            if (existing == null || existing.isEmpty()) {
                                System.setProperty(key, val);
                                loadedCount++;
                            }
                        }
                    }
                }
            } catch (IOException e) {
                System.err.println("[CampusChanakya WARNING] Failed reading " + envFile.getName() + ": " + e.getMessage());
            }
        }
        System.out.println("[CampusChanakya] Successfully loaded " + loadedCount + " non-empty environment properties into System environment.");
    }
}
