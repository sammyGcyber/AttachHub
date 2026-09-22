-- AttachHub Database Schema (PostgreSQL / MySQL compatible DDL)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'company', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    institution VARCHAR(150) NOT NULL,
    course VARCHAR(150) NOT NULL,
    year_of_study VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    skills TEXT,
    cv_url VARCHAR(255),
    availability_start DATE,
    availability_end DATE
);

-- 3. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255)
);

-- 4. Listings Table
CREATE TABLE IF NOT EXISTS listings (
    listing_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    slots_available INT DEFAULT 1,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    application_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES listings(listing_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected')),
    match_score DECIMAL(5,2) DEFAULT 0.00,
    cover_note TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, listing_id)
);

-- 6. Verification Requests Table
CREATE TABLE IF NOT EXISTS verification_requests (
    verification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    submitted_document VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP
);

-- Indexes for search and join performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_listings_company ON listings(company_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_listing ON applications(listing_id);
