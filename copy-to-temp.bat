@echo off
echo Copying project to C:\temp\massage-course...
xcopy /E /I /Y "C:\Users\danik\OneDrive\מסמכים\Projects\massage-course" "C:\temp\massage-course"
echo Done!
echo.
echo Navigate to C:\temp\massage-course\massage-course-backend
echo Then run: php artisan serve
pause
