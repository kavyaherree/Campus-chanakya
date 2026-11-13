# Error 001: MySQL Query Grammar Parser Failure on Parameterized LIMIT Clause

## Component
`backend/src/main/java/com/campuschanakya/repository/QuestionRepository.java`

## Symptom & Error Description
The IDE and SQL AST language validator flagged an error:
```text
MySQL: no viable alternative at input 'SELECT * FROM questions WHERE LOWER(skill_name) = LOWER(:skillName) ORDER BY RAND() LIMIT :limit'
```

## Root Cause
In standard MySQL grammar and SQL language server AST parsers, `LIMIT` accepts constant integer literals, not named parameterized tokens like `:limit`. In Spring Data JPA native queries, parameterized limit clauses also break portability across database dialects (H2, MySQL, PostgreSQL).

## Security & Reliability Impact
Query compilation failures or dialect mismatch when switching between embedded H2 in-memory testing and production MySQL databases.
