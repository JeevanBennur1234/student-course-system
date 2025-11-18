import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('My courses fetched:', response.data);
        setCourses(response.data.data || []);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load your courses. Please try again later.');
        }
        console.error('Error fetching my courses:', err);
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [token, navigate]);

  const handleUnenroll = async (enrollmentId, courseTitle) => {
    if (!confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses(courses.filter(course => course.enrollmentId !== enrollmentId));
      alert(response.data.message || 'Successfully unenrolled from course');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(err.response?.data?.message || 'Failed to unenroll. Please try again.');
      }
      console.error('Unenroll error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            My Courses
          </h1>
          <p className="text-gray-600 text-center">
            Manage your enrolled courses
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
          <div className="bg-blue-50 border border-blue-400 text-blue-700 px-6 py-8 rounded-lg max-w-2xl mx-auto text-center">
            <svg 
              className="w-16 h-16 mx-auto mb-4 text-blue-500" 
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
            <h3 className="text-lg font-semibold mb-2">No Enrolled Courses Yet</h3>
            <p className="mb-4">Start your learning journey by enrolling in courses!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.enrollmentId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {course.title}
                  </h3>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded ml-2">
                    Active
                  </span>
                </div>
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

                {course.enrolledAt && (
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Enrolled:</span>
                    <span className="ml-1">{new Date(course.enrolledAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleUnenroll(course.enrollmentId, course.title)}
                className="w-full py-2 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Unenroll
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyCoursesPage;
