const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching courses', 
      error: error.message 
    });
  }
});

// GET /api/courses/:id - Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching course', 
      error: error.message 
    });
  }
});

// POST /api/courses - Create a new course
router.post('/', async (req, res) => {
  try {
    const { courseId, title, description, instructor, credits } = req.body;

    // Check if course with courseId already exists
    const courseExists = await Course.findOne({ courseId });

    if (courseExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Course with this courseId already exists' 
      });
    }

    // Create new course
    const course = await Course.create({
      courseId,
      title,
      description,
      instructor,
      credits
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error creating course', 
      error: error.message 
    });
  }
});

module.exports = router;
