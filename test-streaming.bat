@echo off
chcp 65001 >nul
echo ========================================
echo    Test Streaming con FFmpeg
echo ========================================
echo.

echo Scegli un'opzione:
echo.
echo 1. Test con video esistente
echo 2. Test con webcam
echo 3. Test con cattura schermo
echo 4. Test con hardware acceleration (NVIDIA)
echo 5. Test connessione RTMP
echo 6. Esci
echo.

set /p choice="Inserisci la tua scelta (1-6): "

if "%choice%"=="1" goto test_video
if "%choice%"=="2" goto test_webcam
if "%choice%"=="3" goto test_screen
if "%choice%"=="4" goto test_hardware
if "%choice%"=="5" goto test_connection
if "%choice%"=="6" goto exit
goto invalid

:test_video
echo.
echo 🎬 Test streaming con video esistente...
echo Stream Key: test-video
echo.
echo Apri http://localhost:3000 e inserisci "test-video" per guardare
echo.
pause
ffmpeg -re -i test-video-with-audio.mp4 -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/test-video
goto end

:test_webcam
echo.
echo 📹 Test streaming con webcam...
echo Stream Key: webcam-test
echo.
echo Apri http://localhost:3000 e inserisci "webcam-test" per guardare
echo.
echo ATTENZIONE: Assicurati che la webcam non sia usata da altre app
echo.
pause
ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -f dshow -i audio="Microfono (Realtek Audio)" -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/webcam-test
goto end

:test_screen
echo.
echo 🖥️ Test streaming con cattura schermo...
echo Stream Key: screen-test
echo.
echo Apri http://localhost:3000 e inserisci "screen-test" per guardare
echo.
echo ATTENZIONE: Questo catturerà tutto lo schermo
echo.
pause
ffmpeg -f gdigrab -i desktop -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/screen-test
goto end

:test_hardware
echo.
echo ⚡ Test streaming con hardware acceleration (NVIDIA)...
echo Stream Key: hw-test
echo.
echo Apri http://localhost:3000 e inserisci "hw-test" per guardare
echo.
echo ATTENZIONE: Richiede scheda grafica NVIDIA
echo.
pause
ffmpeg -re -i test-video-with-audio.mp4 -c:v h264_nvenc -preset fast -c:a aac -f flv rtmp://localhost:1935/live/hw-test
goto end

:test_connection
echo.
echo 🔗 Test connessione RTMP...
echo.
echo Questo invierà un breve test al server
echo.
pause
ffmpeg -f lavfi -i testsrc=duration=10:size=640x480:rate=30 -c:v libx264 -preset ultrafast -f flv rtmp://localhost:1935/live/connection-test
goto end

:invalid
echo.
echo ❌ Scelta non valida. Riprova.
echo.
pause
goto start

:exit
echo.
echo Arrivederci!
exit /b 0

:end
echo.
echo Streaming terminato.
pause


