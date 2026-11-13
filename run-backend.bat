@echo off
setlocal
set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.0.1\jbr"
set "PATH=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.0.1\jbr\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.0.1\plugins\maven-plugin\lib\maven3\bin;%PATH%"

echo ==============================================================================
echo CampusChanakya - Spring Boot 3 Backend Server
echo ==============================================================================
echo JAVA_HOME: %JAVA_HOME%
java -version

cd /d "%~dp0backend"
if exist target attrib -r /s /d target\* >nul 2>&1
echo Launching Maven Spring Boot Application on port 8080...
call mvn clean spring-boot:run
pause
