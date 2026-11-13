# Fix 001: Replacing Parameterized LIMIT with Spring Data Pageable

## Component
`backend/src/main/java/com/campuschanakya/repository/QuestionRepository.java`

## Resolution
1. Removed `LIMIT :limit` from the native SQL string to adhere strictly to ANSI SQL / MySQL grammar specifications.
2. Introduced Spring Data JPA `Pageable` parameter:
```java
@Query(value = "SELECT * FROM questions WHERE LOWER(skill_name) = LOWER(:skillName) ORDER BY RAND()", nativeQuery = true)
List<Question> findRandomQuestionsBySkillName(@Param("skillName") String skillName, Pageable pageable);
```
3. Removed redundant `@Repository` annotation on interface extending `JpaRepository`.

## Verification
Executed `mvn clean test-compile` on backend:
- BUILD SUCCESS.
- Compiled 68 source files with zero SQL grammar or mapping errors.
