-- Manual migration script to fix the single-course system
-- Run this in your MySQL database to apply the changes

-- First, let's check current tables
SHOW TABLES;

-- Remove course_id from user_progress table
ALTER TABLE user_progress DROP COLUMN course_id;

-- Remove course_id from modules table (if it exists)
ALTER TABLE modules DROP COLUMN course_id;

-- Remove course_id from certificates table (if it exists)
ALTER TABLE certificates DROP FOREIGN KEY certificates_course_id_foreign;
ALTER TABLE certificates DROP COLUMN course_id;

-- Remove course_id from user_certificates table (if it exists)
ALTER TABLE user_certificates DROP COLUMN course_id;

-- Remove course_id from payments table (if it exists)
ALTER TABLE payments DROP COLUMN course_id;

-- Drop course_enrollments table
DROP TABLE IF EXISTS course_enrollments;

-- Drop courses table
DROP TABLE IF EXISTS courses;

-- Show remaining tables
SHOW TABLES;
