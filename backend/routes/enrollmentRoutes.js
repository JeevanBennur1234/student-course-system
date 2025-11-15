const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// POST /api/enrollments - Enroll in a course
router.post('/', authenticate, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false,
        message: 'You are already enrolled in this course' 
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error enrolling in course', 
      error: error.message 
    });
  }
});

// GET /api/enrollments/my-courses - Get user's enrolled courses
router.get('/my-courses', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const enrollments = await Enrollment.find({ user: userId })
      .populate('course')
      .sort({ enrolledAt: -1 });

    const courses = enrollments.map(enrollment => ({
      ...enrollment.course.toObject(),
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt,
      status: enrollment.status
    }));

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching enrolled courses', 
      error: error.message 
    });
  }
});

// GET /api/enrollments/check/:courseId - Check if user is enrolled in a course
router.get('/check/:courseId', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error checking enrollment', 
      error: error.message 
    });
  }
});

// DELETE /api/enrollments/:enrollmentId - Unenroll from a course
router.delete('/:enrollmentId', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    });

    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: 'Enrollment not found' 
      });
    }

    await Enrollment.findByIdAndDelete(enrollmentId);

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error unenrolling from course', 
      error: error.message 
    });
  }
});

module.exports = router;
