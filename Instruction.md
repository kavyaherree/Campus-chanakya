# AI Developer Collaboration Instructions

This document outlines the core instructions, rules, and expected behavior for the AI when assisting with code, architecture, or general project development for CampusChanakya.

## 1. Handling Large Outputs (Chunking)
- **Size Limits:** If the requested code, output, or generated file is too large to be provided reliably in a single response, **do not attempt to send it all at once**.
- **Logical Chunks:** Break the output down into logical, manageable pieces (e.g., providing 20% to 50% of the content at a time, depending on the overall size).
- **Interactive Delivery:** Provide the first chunk, state clearly what part of the whole it represents (e.g., "Part 1 of 4"), and pause. Wait for the prompt to "continue" before delivering the next segment to ensure nothing is truncated or lost.

## 2. Code Quality & Project Guidance
**Notes**: Maintain the proper architecture and patterns used for backend (Java 17, Spring Boot 3, Spring Security 6, Spring Data JPA, OOPJ Pillars, and SOLID Principles) and frontend (React 18, Vite, Tailwind CSS, Lucide Icons) in this application.

- **Best Practices:** Write optimized code with **all security checks and validation applied**, clean, and modular. Always include proper error handling and prioritize maintainability.
- **Academic & Viva Integrity:** Preserve OOP encapsulation (private fields, validation in getters/setters), polymorphism (Strategy pattern for evaluators), abstraction (interfaces for services and evaluators), and inheritance (BaseEntity).

**Notes**: Always check for `Project_Memory` folder and read it first to get an idea of the project and code stage. Update the `Project_Memory` folder whenever adding a new feature or crucial code.

- **Project Roadmaps:** When guiding this project, always provide:
  - An architecture overview.
  - Required tools and libraries.
  - A step-by-step implementation roadmap.
  - Potential challenges, edge cases, and academic viva points.
- **Code Reviews:** Do not just fix errors; proactively suggest structural optimizations and OOP alignment.

## 3. Problem Solving & Communication
- **No Assumptions:** Do not assume missing details in requirements. Ask clarifying questions before writing extensive code.
- **Concise & Dense:** Keep responses concise but information-dense. Avoid repetitive phrases, filler language, and unnecessary fluff.
- **Honesty & Verification:** Prioritize correctness over speed. If uncertain about a specific library function or implementation, state limitations clearly instead of guessing.
- **Actionable Next Steps:** Conclude technical guidance and code blocks with clear, actionable next steps.

## 4. Formatting & Structure
- **Readability:** Maintain logical flow using Markdown headings, bullet points, and numbered lists.
- **Comparisons:** Use structured comparison tables when comparing different technologies, frameworks, or approaches.
- **Visuals:** Use ASCII diagrams or conceptual explanations if they help visualize complex architectures, database schemas, or logic flows.
- **Security:** For any authentication, authorization, or sensitive data logic, include a threat perspective and the corresponding defense strategy.

## 5. Important Errors and Their Fixes
Create a memory in the `Project_Memory/Important_Errors_and_Fixes` folder for important errors explaining the error and issues in a `number_Error_Name.md` file and its proper fix in a `number_Fix_Name.md` file. This ensures future code security and quality.

## 6. Do Not Use Emojis
Try not to use emojis and use only when showing a very important part of code or file.
