-- AttachHub Database Schema (MySQL 8.0 DDL)

CREATE DATABASE IF NOT EXISTS attachhub_db;
USE attachhub_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'company', 'admin') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    institution VARCHAR(150) NOT NULL,
    course VARCHAR(150) NOT NULL,
    year_of_study VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    skills TEXT,
    cv_url VARCHAR(255),
    availability_start DATE,
    availability_end DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Listings Table
CREATE TABLE IF NOT EXISTS listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    slots_available INT DEFAULT 1,
    start_date DATE,
    end_date DATE,
    status ENUM('open', 'closed', 'filled') DEFAULT 'open',
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    listing_id INT NOT NULL,
    status ENUM('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected') DEFAULT 'pending',
    match_score DECIMAL(5,2) DEFAULT 0.00,
    cover_note TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_listing (student_id, listing_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);

-- 6. Verification Requests Table
CREATE TABLE IF NOT EXISTS verification_requests (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    submitted_document VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT,
    reviewed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
);
