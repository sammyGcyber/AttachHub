# AttachHub — Digital Industrial Attachment & Internship Placement Platform

**AttachHub** is a web-based platform designed to connect students seeking industrial attachment or internship placements with verified companies offering them. The platform digitizes the application process, eliminating physical walk-ins and printed letters while providing structured matching, application tracking, and administrative verification.

---

## 🚀 Key Features

### 🎓 Student Features
- **Profile & CV Management**: Build verified profiles detailing course, institution, skills, and availability; upload digital CVs.
- **Listing Search & Filtering**: Search available placement opportunities by industry, location, duration, and department.
- **Compatibility Match Scoring**: View real-time match scores ranking profile suitability against company requirements.
- **Application Lifecycle Tracking**: Monitor application status live (`pending`, `reviewed`, `shortlisted`, `accepted`, `rejected`).

### 🏢 Company / Employer Features
- **Listing Management**: Post, edit, update, and close industrial attachment openings.
- **Applicant Screening**: View incoming applications, inspect applicant profiles, download CVs, and assess match scores.
- **Status Workflows**: Review applications and update candidate statuses digitally.

### 🛡️ Administrator Features
- **Account Verification**: Review and approve/reject student and company registration requests.
- **Listing Moderation**: Moderate posted attachment listings to ensure institutional compliance.
- **Platform Analytics**: Monitor overall user activity, active listings, and placement statistics.

---

## 🛠️ Architecture & Tech Stack

AttachHub is built using a 3-tier RESTful architecture:

- **Frontend (`client/`)**: React.js, React Router, Axios, CSS / Responsive Design.
- **Backend (`server/`)**: Node.js, Express.js (MVC Pattern: Routes, Controllers, Models, Middleware).
- **Database**: Relational Database (PostgreSQL / MySQL).
- **Security**: JWT (JSON Web Tokens) for authentication + `bcryptjs` for password hashing + RBAC middleware.

---

## 📁 Repository Structure

```text
AttachHub/
├── README.md                           # Project Overview & Setup Documentation
├── client/                             # React Frontend Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/                     # Graphics, logos, and icons
│   │   ├── components/                 # Reusable UI Components
│   │   │   ├── NavBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── ApplicationStatusBadge.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/                    # React Context (Auth State)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                      # Application Views & Pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ListingDetails.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/                   # API Integration Layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── listingService.js
│   │   │   └── applicationService.js
│   │   ├── styles/                     # CSS stylesheets
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── server/                             # Node.js / Express Backend API
    ├── config/
    │   └── db.js                       # Database connection pool setup
    ├── controllers/                    # Request logic & business workflows
    │   ├── adminController.js
    │   ├── applicationController.js
    │   ├── authController.js
    │   ├── companyController.js
    │   ├── listingController.js
    │   └── studentController.js
    ├── database/
    │   └── schema.sql                  # Database creation script & migrations
    ├── middleware/                     # Authentication & authorization middleware
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── roleMiddleware.js
    ├── models/                         # Data access layer / query builders
    │   ├── applicationModel.js
    │   ├── companyModel.js
    │   ├── listingModel.js
    │   ├── studentModel.js
    │   └── userModel.js
    ├── routes/                         # API Endpoint definitions
    │   ├── adminRoutes.js
    │   ├── applicationRoutes.js
    │   ├── authRoutes.js
    │   ├── companyRoutes.js
    │   ├── listingRoutes.js
    │   └── studentRoutes.js
    ├── package.json
    └── server.js                       # Server entry point
```

---

## 🗄️ Database Schema Summary

The relational schema in `server/database/schema.sql` consists of the following core tables:

1. **`users`**: Central account entity (`user_id`, `email`, `password_hash`, `role`, `is_verified`).
2. **`students`**: Student profile details (`student_id`, `user_id`, `full_name`, `institution`, `course`, `skills`, `cv_url`, `availability_start`, `availability_end`).
3. **`companies`**: Organisation profiles (`company_id`, `user_id`, `company_name`, `industry`, `location`, `description`, `website`).
4. **`listings`**: Placement openings (`listing_id`, `company_id`, `title`, `department`, `requirements`, `slots_available`, `status`).
5. **`applications`**: Submitted applications (`application_id`, `student_id`, `listing_id`, `status`, `match_score`, `cover_note`).
6. **`verification_requests`**: Administrative audit trail for verification (`verification_id`, `user_id`, `submitted_document`, `status`).

---

## 💻 Getting Started & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/)

### 1. Database Setup
Execute the SQL script located in `server/database/schema.sql` against your relational database server:
```bash
psql -U postgres -d attachhub_db -f server/database/schema.sql
```

### 2. Backend Setup (`server`)
```bash
cd server
npm install
cp .env.example .env
# Update .env with your DB credentials and JWT_SECRET
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup (`client`)
```bash
cd client
npm install
cp .env.example .env
# Update .env with VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```
The client app will be accessible at `http://localhost:5173`.

---

## 🔒 Environment Configuration

### Backend (`server/.env.example`)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=attachhub_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### Frontend (`client/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📄 License
This project is developed for educational and institutional placement purposes. All rights reserved.
