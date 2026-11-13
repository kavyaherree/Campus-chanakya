# Temporary Changes & Stubs

This document tracks temporary mocks, stubs, and overrides currently in place that are scheduled for replacement with production services.

---

## 1. AI Redemption Plan Curriculum Generation
- **Current State:** `RedemptionServiceImpl.java` generates a structured mock 3-day recovery curriculum JSON formatted with core topics.
- **Permanent Goal:** Call live Gemini 2.0 Flash / OpenAI API via HTTP client using configured `GOOGLE_API_KEY1` from `.env`.

---

## 2. In-Memory H2 Database
- **Current State:** Default datasource points to in-memory H2 DB for immediate zero-config testing.
- **Permanent Goal:** Production deployments point to persistent MySQL instance configured in `.env`.
