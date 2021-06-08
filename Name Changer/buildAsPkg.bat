@echo off
echo. && echo Checking if node.js is installed && echo.
call node -v
if errorlevel 1 echo. && echo You must have node.js installed, install from https://nodejs.org/en/ && goto :EOF
echo. && echo Checking if npm is installed && echo.
call npm -v
if errorlevel 1 echo. && echo You must have node package manager installed, install from https://docs.npmjs.com/downloading-and-installing-node-js-and-npm && goto :EOF
echo. && echo Checking if pkg is installed && echo.
call pkg -v
if errorlevel 1 echo. && echo Package is not currently installed... install with "npm install -g pkg" or from https://www.npmjs.com/package/pkg && goto :EOF
echo. && echo Installing all dependencies && echo.
call npm i
echo. && echo Packaging the script && echo.
call pkg package.json
echo. && echo.
echo Complete
