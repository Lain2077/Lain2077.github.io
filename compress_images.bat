@echo off
setlocal enabledelayedexpansion

:: ============================================================
::  compress_images.bat
::  Compresses all images under projects-data\ to JPEG in-place
::  Requires: ImageMagick 7  (magick command)
:: ============================================================

set "QUALITY=85"
set "TARGET_DIR=%~dp0projects-data"
set "LOG_FILE=%~dp0projects-data\compress_log.txt"

echo ============================================================
echo  Image Compressor  ^|  Quality: %QUALITY%
echo  Target : %TARGET_DIR%
echo  Log    : %LOG_FILE%
echo ============================================================
echo.

:: Clear / create log
echo Image Compression Log - %DATE% %TIME% > "%LOG_FILE%"
echo Quality: %QUALITY% >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"

set "COUNT=0"

:: Supported extensions to process
for /r "%TARGET_DIR%" %%F in (*.png *.jpg *.jpeg *.bmp *.gif *.webp *.tiff *.tif) do (
    call :process_file "%%F" "%%~xF" "%%~dpF" "%%~nF" %%~zF
)

echo ============================================================
echo  Done! Processed %COUNT% file(s).
echo  See %LOG_FILE% for details.
echo ============================================================

echo. >> "%LOG_FILE%"
echo Total files processed: %COUNT% >> "%LOG_FILE%"

endlocal
pause
goto :eof

:: ============================================================
:process_file
::  %1 = full path   %2 = extension   %3 = dir   %4 = name   %5 = size
:: ============================================================
set "SRC=%~1"
set "SRC_EXT=%~2"
set "SRC_DIR=%~3"
set "SRC_NAME=%~4"
set "BEFORE_SIZE=%~5"
set "DEST=%~3%~4.jpg"
set "TMPFILE=%~3%~4.__tmp__.jpg"

echo [%~4%~2]  (%~5 bytes)
echo   converting to JPG at quality %QUALITY%...

set "IS_JPG=0"
if /i "%~2"==".jpg"  set "IS_JPG=1"
if /i "%~2"==".jpeg" set "IS_JPG=1"

if "%IS_JPG%"=="1" (
    magick "%SRC%" -quality %QUALITY% -sampling-factor 4:2:0 -strip "%TMPFILE%" 2>nul
    if not exist "%TMPFILE%" (
        echo   [ERROR] conversion failed - skipping
        echo [ERROR] %SRC% >> "%LOG_FILE%"
        goto :eof
    )
    del "%SRC%"
    ren "%TMPFILE%" "%SRC_NAME%.jpg"
) else (
    magick "%SRC%" -quality %QUALITY% -sampling-factor 4:2:0 -strip -background white -flatten "%DEST%" 2>nul
    if not exist "%DEST%" (
        echo   [ERROR] conversion failed - skipping
        echo [ERROR] %SRC% >> "%LOG_FILE%"
        goto :eof
    )
    del "%SRC%"
)

for %%S in ("%DEST%") do set "AFTER_SIZE=%%~zS"

echo   done  (%AFTER_SIZE% bytes)
echo.

echo OK: %SRC_NAME%%SRC_EXT% >> "%LOG_FILE%"
echo    Before : %BEFORE_SIZE% bytes >> "%LOG_FILE%"
echo    After  : %AFTER_SIZE% bytes >> "%LOG_FILE%"
echo ------------------------------------------------------------ >> "%LOG_FILE%"

set /a COUNT+=1
goto :eof
