const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const connectDB = require('./db');

dotenv.config();

const sampleCourses = [
  {
    courseId: 'CS101',
    title: 'C Programming',
    description: 'Learn the fundamentals of C programming language including variables, data types, control structures, functions, pointers, arrays, and file handling. Perfect for beginners.',
    instructor: 'Prof. John Smith',
    credits: 3
  },
  {
    courseId: 'CS102',
    title: 'Python Programming',
    description: 'Master Python programming from basics to advanced concepts. Cover syntax, data structures, OOP, file handling, and popular libraries like NumPy and pandas.',
    instructor: 'Dr. Sarah Wilson',
    credits: 3
  },
  {
    courseId: 'CS103',
    title: 'Java Programming',
    description: 'Complete Java programming course covering OOP principles, inheritance, polymorphism, exception handling, collections framework, and multithreading.',
    instructor: 'Prof. Michael Brown',
    credits: 4
  },
  {
    courseId: 'WEB101',
    title: 'Web Development',
    description: 'Learn to build modern websites using HTML, CSS, JavaScript, and responsive design. Create interactive web pages and understand web development fundamentals.',
    instructor: 'Dr. Emily Davis',
    credits: 3
  },
  {
    courseId: 'CS201',
    title: 'Data Structures and Algorithms',
    description: 'Study essential data structures like arrays, linked lists, stacks, queues, trees, and graphs. Learn sorting, searching algorithms and problem-solving techniques.',
    instructor: 'Prof. Robert Johnson',
    credits: 4
  },
  {
    courseId: 'DB101',
    title: 'Database Management',
    description: 'Introduction to databases, SQL queries, database design, normalization, and basic operations with MySQL and PostgreSQL.',
    instructor: 'Dr. Lisa Anderson',
    credits: 3
  },
  {
    courseId: 'WEB201',
    title: 'Full Stack Development',
    description: 'Build complete web applications using MERN stack (MongoDB, Express, React, Node.js). Learn both frontend and backend development.',
    instructor: 'Prof. David Lee',
    credits: 4
  },
  {
    courseId: 'CS104',
    title: 'JavaScript Programming',
    description: 'Master JavaScript including ES6+ features, DOM manipulation, async programming, and modern JavaScript frameworks and tools.',
    instructor: 'Dr. Jennifer Martinez',
    credits: 3
  },
  {
    courseId: 'CS301',
    title: 'Object-Oriented Programming',
    description: 'Deep dive into OOP concepts including classes, objects, inheritance, polymorphism, encapsulation, and design patterns.',
    instructor: 'Prof. Thomas White',
    credits: 3
  },
  {
    courseId: 'CS105',
    title: 'C++ Programming',
    description: 'Learn C++ programming including advanced features like templates, STL, memory management, and modern C++ standards.',
    instructor: 'Dr. Amanda Garcia',
    credits: 3
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seed...');
    
    // Clear existing courses (optional - comment out if you want to keep existing data)
    await Course.deleteMany({});
    console.log('✅ Cleared existing courses');
    
    // Insert sample courses
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`✅ Successfully added ${insertedCourses.length} courses to the database`);
    
    console.log('\n📚 Courses added:');
    insertedCourses.forEach(course => {
      console.log(`   - ${course.courseId}: ${course.title}`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
