const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'attachhub.sqlite');
const db = new DatabaseSync(dbPath);

async function seed() {
  console.log('Seeding AttachHub database with rich sample data...');

  // Reset tables
  db.exec(`
    DELETE FROM applications;
    DELETE FROM listings;
    DELETE FROM companies;
    DELETE FROM students;
    DELETE FROM verification_requests;
    DELETE FROM users;
  `);

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const users = [
    { email: 'student@attachhub.com', role: 'student', is_verified: 1 },
    { email: 'sarah.juma@student.ac.ke', role: 'student', is_verified: 1 },
    { email: 'david.otieno@student.ac.ke', role: 'student', is_verified: 1 },
    { email: 'safaricom@attachhub.com', role: 'company', is_verified: 1 },
    { email: 'equity@attachhub.com', role: 'company', is_verified: 1 },
    { email: 'cybershield@attachhub.com', role: 'company', is_verified: 1 },
    { email: 'andela@attachhub.com', role: 'company', is_verified: 1 },
    { email: 'admin@attachhub.com', role: 'admin', is_verified: 1 },
  ];

  const userIds = {};
  const insertUserStmt = db.prepare(
    'INSERT INTO users (email, password_hash, role, is_verified) VALUES (?, ?, ?, ?)'
  );

  for (const u of users) {
    const info = insertUserStmt.run(u.email, passwordHash, u.role, u.is_verified);
    userIds[u.email] = Number(info.lastInsertRowid);
  }

  // 2. Create Students
  const insertStudentStmt = db.prepare(`
    INSERT INTO students (user_id, full_name, institution, course, year_of_study, phone, skills, cv_url, availability_start, availability_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const student1Info = insertStudentStmt.run(
    userIds['student@attachhub.com'],
    'Alex Mwangi',
    'Jomo Kenyatta University of Agriculture and Technology',
    'Diploma in Information Technology',
    'Year 2',
    '+254 712 345 678',
    'React, Node.js, JavaScript, Python, SQL, Git, REST APIs',
    '/uploads/cv_alex_mwangi.pdf',
    '2026-10-01',
    '2026-12-31'
  );
  const student1Id = Number(student1Info.lastInsertRowid);

  const student2Info = insertStudentStmt.run(
    userIds['sarah.juma@student.ac.ke'],
    'Sarah Juma',
    'Strathmore University',
    'BSc Business Information Technology',
    'Year 3',
    '+254 723 456 789',
    'Cybersecurity, Linux, Wireshark, Python, Network Security, Ethical Hacking',
    '/uploads/cv_sarah_juma.pdf',
    '2026-10-15',
    '2027-01-15'
  );

  const student3Info = insertStudentStmt.run(
    userIds['david.otieno@student.ac.ke'],
    'David Otieno',
    'University of Nairobi',
    'BSc Computer Science',
    'Year 4',
    '+254 734 567 890',
    'Python, Data Analysis, SQL, Machine Learning, Tableau, PowerBI',
    '/uploads/cv_david_otieno.pdf',
    '2026-10-01',
    '2027-03-31'
  );

  // 3. Create Companies
  const insertCompanyStmt = db.prepare(`
    INSERT INTO companies (user_id, company_name, industry, location, description, website)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const comp1Info = insertCompanyStmt.run(
    userIds['safaricom@attachhub.com'],
    'Safaricom Innovation Labs',
    'Telecommunications & ICT',
    'Nairobi, Westlands',
    'Leading digital solutions provider and fintech pioneer in East Africa, powering M-PESA and next-gen cloud platforms.',
    'https://safaricom.co.ke/careers'
  );
  const comp1Id = Number(comp1Info.lastInsertRowid);

  const comp2Info = insertCompanyStmt.run(
    userIds['equity@attachhub.com'],
    'Equity Group Digital Hub',
    'Financial Services & Fintech',
    'Nairobi, Upper Hill',
    'Pioneering digital banking, AI fraud detection, and mobile financial services across the region.',
    'https://equitygroupholdings.com'
  );
  const comp2Id = Number(comp2Info.lastInsertRowid);

  const comp3Info = insertCompanyStmt.run(
    userIds['cybershield@attachhub.com'],
    'CyberShield Africa',
    'Cybersecurity & Managed SOC',
    'Nairobi, Kilimani',
    'Premier enterprise cybersecurity firm delivering threat intelligence, penetration testing, and 24/7 SOC operations.',
    'https://cybershield.africa'
  );
  const comp3Id = Number(comp3Info.lastInsertRowid);

  const comp4Info = insertCompanyStmt.run(
    userIds['andela@attachhub.com'],
    'Andela Learning Community',
    'Software Engineering & Cloud',
    'Remote / Nairobi Hub',
    'Global talent marketplace connecting top tech talent with leading international engineering organizations.',
    'https://andela.com'
  );
  const comp4Id = Number(comp4Info.lastInsertRowid);

  // 4. Create Listings
  const insertListingStmt = db.prepare(`
    INSERT INTO listings (company_id, title, department, description, requirements, slots_available, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const listing1Info = insertListingStmt.run(
    comp1Id,
    'Junior Full-Stack Web Development Attaché',
    'Engineering & Digital Products',
    'Join the core digital products team to assist in building modern web interfaces, optimizing RESTful API microservices, and collaborating on high-scale cloud platforms.',
    'React, Node.js, JavaScript, HTML, CSS, SQL, Git',
    4,
    '2026-10-01',
    '2026-12-31',
    'open'
  );
  const listing1Id = Number(listing1Info.lastInsertRowid);

  const listing2Info = insertListingStmt.run(
    comp3Id,
    'Cybersecurity Analyst & SOC Trainee',
    'Security Operations Center (SOC)',
    'Gain hands-on industrial experience monitoring network telemetry, assisting with vulnerability assessments, analyzing log anomalies, and learning penetration testing methodologies.',
    'Linux, Networking, Wireshark, Cybersecurity fundamentals, Python',
    2,
    '2026-10-15',
    '2027-01-15',
    'open'
  );
  const listing2Id = Number(listing2Info.lastInsertRowid);

  const listing3Info = insertListingStmt.run(
    comp2Id,
    'Data Analytics & Business Intelligence Intern',
    'Data & Analytics',
    'Work closely with senior data scientists to clean financial datasets, build automated Tableau/PowerBI dashboards, and execute exploratory SQL queries.',
    'Python, SQL, Data Analysis, Excel, Tableau, PowerBI',
    3,
    '2026-10-01',
    '2027-03-31',
    'open'
  );
  const listing3Id = Number(listing3Info.lastInsertRowid);

  const listing4Info = insertListingStmt.run(
    comp4Id,
    'Cloud Systems & DevOps Trainee',
    'Infrastructure & Cloud Operations',
    'Assist in setting up CI/CD pipelines, containerizing Node/Python microservices with Docker, and monitoring cloud deployments on AWS & Linux servers.',
    'Linux, Git, Docker, Python, Bash Scripting, Networking',
    5,
    '2026-11-01',
    '2027-02-28',
    'open'
  );
  const listing4Id = Number(listing4Info.lastInsertRowid);

  const listing5Info = insertListingStmt.run(
    comp1Id,
    'IT User Support & Network Infrastructure Attaché',
    'IT Operations & Network Infrastructure',
    'Provide technical support for enterprise hardware, configure local area networks (LAN/VLAN), manage Active Directory accounts, and troubleshoot system issues.',
    'Hardware Troubleshooting, Windows Server, Networking, Active Directory',
    3,
    '2026-10-01',
    '2026-12-31',
    'open'
  );

  // 5. Create Sample Applications
  const insertAppStmt = db.prepare(`
    INSERT INTO applications (student_id, listing_id, status, match_score, cover_note)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertAppStmt.run(
    student1Id,
    listing1Id,
    'shortlisted',
    94.50,
    'I am highly passionate about full-stack web development with React and Node.js. My academic projects closely align with Safaricom innovation standards.'
  );

  insertAppStmt.run(
    student1Id,
    listing3Id,
    'reviewed',
    78.00,
    'I have solid background knowledge in SQL database design and data querying, and I am eager to expand into business intelligence.'
  );

  insertAppStmt.run(
    student1Id,
    listing4Id,
    'pending',
    82.50,
    'I am keen to develop hands-on DevOps skills using Docker and Linux environment tools.'
  );

  console.log('Seeding completed successfully! 🎉');
}

seed().catch(err => {
  console.error('Seeding error:', err);
});
