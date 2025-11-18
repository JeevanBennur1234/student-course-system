import { useState, useEffect } from 'react';
import axios from 'axios';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        console.log('Courses fetched:', response.data);
        setCourses(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        console.error('Error fetching courses:', err);
        setLoading(false);
      }
    };

    const fetchEnrollments = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const enrolledIds = new Set(response.data.data.map(c => c._id));
        setEnrolledCourses(enrolledIds);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        console.error('Error fetching enrollments:', err);
      }
    };

    fetchCourses();
    fetchEnrollments();
  }, [token]);

  const handleEnroll = async (courseId) => {
    if (!isLoggedIn) {
      alert('Please login to enroll in courses');
      window.location.href = '/login';
      return;
    }

    setEnrollingCourseId(courseId);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/enrollments`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEnrolledCourses(prev => new Set([...prev, courseId]));
      alert(response.data.message || 'Successfully enrolled in course!');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(err.response?.data?.message || 'Failed to enroll. Please try again.');
      }
      console.error('Enrollment error:', err);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            Available Courses
          </h1>
          <p className="text-gray-600 text-center">
            Explore our comprehensive course catalog
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-2xl mx-auto text-center">
            No courses available at the moment. Check back soon!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id || course.courseId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {course.courseId}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="border-t pt-4 space-y-2 mb-4">
                {course.instructor && (
                  <div className="flex items-center text-sm text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">Instructor:</span>
                    <span className="ml-1">{course.instructor}</span>
                  </div>
                )}

                {course.credits && (
                  <div className="flex items-center text-sm text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="font-medium">Credits:</span>
                    <span className="ml-1">{course.credits}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleEnroll(course._id)}
                disabled={enrolledCourses.has(course._id) || enrollingCourseId === course._id}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  enrolledCourses.has(course._id)
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {enrollingCourseId === course._id ? (
                  'Enrolling...'
                ) : enrolledCourses.has(course._id) ? (
                  '✓ Enrolled'
                ) : (
                  'Enroll Now'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
