const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Admin = require('../models/Admin');

const initSchema = async () => {
  // Create tables if they do not exist
  await query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'Eventra Admin',
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      time TEXT NOT NULL,
      venue TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      registration_deadline TIMESTAMPTZ NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE,
      registration_open BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      college TEXT NOT NULL,
      year TEXT NOT NULL,
      phone TEXT NOT NULL,
      registered_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(event_id, email)
    );

    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
    CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
    CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
  `);

  // Ensure compliance with EVENTRA requirements (Ramanujan Auditorium venue everywhere & clean generic data)
  await query(`
    UPDATE events SET venue = 'Ramanujan Auditorium' WHERE venue != 'Ramanujan Auditorium';
    UPDATE registrations SET college = 'Institute of Technology' WHERE college ILIKE '%ABES%';
  `);
};

const seedData = async () => {
  try {
    await initSchema();

    const adminCount = await Admin.count();
    if (adminCount === 0) {
      console.log('Seeding default admin user...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@Eventra2026!',
        salt
      );

      await Admin.create({
        name: 'Eventra Administrator',
        email: (process.env.ADMIN_EMAIL || 'admin@eventra.dev').toLowerCase(),
        passwordHash
      });
      console.log('Default admin created: admin@eventra.dev / Admin@Eventra2026!');
    }

    const eventCount = await Event.count();
    if (eventCount === 0) {
      console.log('Seeding demo events...');

      const now = new Date();
      const inDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

      const eventsData = [
        {
          name: 'CodeSprint',
          category: 'Coding Competition',
          date: inDays(5),
          time: '04:00 PM - 07:00 PM IST',
          venue: 'Ramanujan Auditorium',
          shortDescription:
            'A rapid-fire competitive programming contest focused on data structures, algorithmic intuition, and time efficiency.',
          description: `CodeSprint is our flagship competitive programming contest designed to prepare students for algorithmic challenges and competitive coding leagues.

The contest features algorithmic challenges ranging from greedy problems to advanced graph theory and dynamic programming.

Rules:
- Standard competition scoring with time penalty for incorrect submissions.
- Allowed languages: C++, Java, Python 3, JavaScript.
- All submissions are verified through automated test suites.

Open to all undergraduate students. Rankings will be published post-contest.`,
          registrationDeadline: inDays(4),
          isFeatured: false,
          registrationOpen: true
        },
        {
          name: 'BuildVerse',
          category: 'Hackathon',
          date: inDays(12),
          time: '09:00 AM - 06:00 PM IST',
          venue: 'Ramanujan Auditorium',
          shortDescription:
            'A collaborative sprint where student teams design, code, and deploy high-impact web and mobile solutions under time pressure.',
          description: `BuildVerse is Eventra's premier hackathon, bringing together college student developers to work on real-world problems in an intensive sprint format.

Whether you are building in full-stack web, cloud-native systems, AI-integrated apps, or developer tools — BuildVerse gives you a structured environment to ship working prototypes.

Tracks:
- Open Innovation & Campus Tech
- AI/ML Developer Tools
- Web & Mobile Applications
- Social Impact & Accessibility

Teams of up to 4 members. Individual registrations also welcome. Mentorship and evaluation provided by technical leads.`,
          registrationDeadline: inDays(10),
          isFeatured: true,
          registrationOpen: true
        },
        {
          name: 'WebCraft Workshop',
          category: 'Workshop',
          date: inDays(15),
          time: '11:00 AM - 03:00 PM IST',
          venue: 'Ramanujan Auditorium',
          shortDescription:
            'A hands-on workshop on modern frontend and backend development — from component design to REST API integration.',
          description: `WebCraft Workshop is a structured hands-on learning day for students who want to build real full-stack web applications.

Sessions:
- Session 1: Modern frontend architecture with React — components, state, and routing.
- Session 2: Building a REST API from scratch — Express, validation, and error handling.
- Session 3: Integrating frontend & backend — authentication flows and data fetching.
- Session 4: Deploying your app — hosting on cloud platforms with CI/CD basics.

Prerequisites: Basic HTML/CSS/JS knowledge. Laptops required.`,
          registrationDeadline: inDays(14),
          isFeatured: false,
          registrationOpen: true
        },
        {
          name: 'TechTalk',
          category: 'Technical Session',
          date: inDays(20),
          time: '03:30 PM - 05:30 PM IST',
          venue: 'Ramanujan Auditorium',
          shortDescription:
            'Deep-dive session into microservices, containerization, and writing clean production-ready code with modern engineering practices.',
          description: `TechTalk brings students and experienced developer mentors together for interactive sessions on real-world production engineering.

Agenda:
1. Anatomy of a production web service: Gateways, services, and databases.
2. Hands-on demo: Containerizing full-stack applications with Docker.
3. Code review clinic: Refactoring messy code into maintainable Clean Architecture.
4. Open Q&A and networking session.

Free registration. Limited seats available in Ramanujan Auditorium.`,
          registrationDeadline: inDays(19),
          isFeatured: false,
          registrationOpen: true
        },
        {
          name: 'Algorithm Arena',
          category: 'Competition',
          date: inDays(25),
          time: '02:00 PM - 05:00 PM IST',
          venue: 'Ramanujan Auditorium',
          shortDescription:
            'Test your logic with mathematical puzzles, algorithmic trick problems, and real-time optimization challenges.',
          description: `Algorithm Arena is aimed at honing fundamental analytical aptitude and mathematical logic for engineering students.

Unlike purely syntax-heavy contests, this event rewards creative thinking, discrete mathematics, and asymptotic analysis.

What to expect:
- Section A: Fast mental math and time complexity puzzles (30 mins)
- Section B: Hands-on implementation of mathematical algorithms (90 mins)
- Section C: Debugging and edge-case handling (60 mins)

No prior competitive programming experience required.`,
          registrationDeadline: inDays(24),
          isFeatured: false,
          registrationOpen: true
        }
      ];

      const createdEvents = await Event.insertMany(eventsData);
      console.log(`Inserted ${createdEvents.length} demo events.`);

      const sampleRegistrations = [
        {
          eventId: createdEvents[1].id || createdEvents[1]._id,
          name: 'Aarav Sharma',
          email: 'aarav.sharma@student.edu',
          college: 'Institute of Technology',
          year: '3rd Year',
          phone: '+91 98765 43210'
        },
        {
          eventId: createdEvents[1].id || createdEvents[1]._id,
          name: 'Priya Verma',
          email: 'priya.v@student.edu',
          college: 'Institute of Technology',
          year: '2nd Year',
          phone: '+91 98112 34567'
        },
        {
          eventId: createdEvents[0].id || createdEvents[0]._id,
          name: 'Rohan Gupta',
          email: 'rohan.g@student.edu',
          college: 'Institute of Technology',
          year: '4th Year',
          phone: '+91 98223 45678'
        },
        {
          eventId: createdEvents[0].id || createdEvents[0]._id,
          name: 'Ananya Mishra',
          email: 'ananya.m@student.edu',
          college: 'Institute of Technology',
          year: '2nd Year',
          phone: '+91 98334 56789'
        },
        {
          eventId: createdEvents[2].id || createdEvents[2]._id,
          name: 'Devansh Pandey',
          email: 'devansh.p@student.edu',
          college: 'Institute of Technology',
          year: '1st Year',
          phone: '+91 98445 67890'
        },
        {
          eventId: createdEvents[3].id || createdEvents[3]._id,
          name: 'Sneha Patel',
          email: 'sneha.patel@student.edu',
          college: 'Institute of Technology',
          year: '3rd Year',
          phone: '+91 98556 78901'
        },
        {
          eventId: createdEvents[4].id || createdEvents[4]._id,
          name: 'Vikram Rajput',
          email: 'vikram.r@student.edu',
          college: 'Institute of Technology',
          year: '2nd Year',
          phone: '+91 98667 89012'
        }
      ];

      await Registration.insertMany(sampleRegistrations);
      console.log(`Inserted ${sampleRegistrations.length} demo registrations.`);
    }
  } catch (err) {
    console.error('Error during seed execution:', err);
  }
};

module.exports = seedData;
