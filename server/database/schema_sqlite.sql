-- AttachHub Database Schema (SQLite 3 DDL)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('student', 'company', 'admin')) NOT NULL,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    institution TEXT NOT NULL,
    course TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    phone TEXT,
    skills TEXT,
    cv_url TEXT,
    availability_start TEXT,
    availability_end TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    company_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    website TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Listings Table
CREATE TABLE IF NOT EXISTS listings (
    listing_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    slots_available INTEGER DEFAULT 1,
    start_date TEXT,
    end_date TEXT,
    status TEXT CHECK (status IN ('open', 'closed', 'filled')) DEFAULT 'open',
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    application_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected')) DEFAULT 'pending',
    match_score REAL DEFAULT 0.00,
    cover_note TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, listing_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);

-- 6. Verification Requests Table
CREATE TABLE IF NOT EXISTS verification_requests (
    verification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    submitted_document TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    reviewed_by INTEGER,
    reviewed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
);
