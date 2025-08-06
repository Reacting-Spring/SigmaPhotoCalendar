@echo off
setlocal

REM 빌드된 JAR 경로 설정 (build/libs 디렉토리 기준)
set JAR_PATH=build\libs\sigma-0.0.1-SNAPSHOT.jar

REM 서버 실행
echo Starting Spring Boot application...
java -jar %JAR_PATH%

pause
