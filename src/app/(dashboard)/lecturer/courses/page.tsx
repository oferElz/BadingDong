"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Represents each individual class scheduled under a course
interface CourseClass {
  type: string; // Type of lecture (class, tutorial, lab)
  day_of_week: string; // Day of the week when the class occurs
  start_time: string; // Start time for the class
  end_time: string; // End time for the class
  student_ids: string[]; // List of enrolled student IDs
}

// Represents a course containing multiple classes
interface Course {
  courseId: string; // Unique course code
  courseName: string; // Display name of the course
  classes: CourseClass[]; // Array of class objects related to the course
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  // Fetch courses data for the lecturer on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `/api/lecturers/courses?lecturerId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Only attempt to fetch courses if there's a user ID
    fetchCourses();
  }, [userId]);

  // Handler for navigating to class records page when a class is clicked
  const handleClassClick = (courseId: string, type: string) => {
    router.push(`/lecturer/courses/${courseId}/records?type=${type}`);
  };

  // Utility function to format and display class schedule
  const getTimeString = (day: string, start: string, end: string) => {
    return `${day}: ${start} - ${end}`;
  };

  return (
    <div className="bg-white dark:bg-dark-container text-black dark:text-dark-text p-6 rounded-md m-4">
      {Array.isArray(courses) && courses.length > 0 ? (
        courses.map((course) => (
          <div key={course.courseId} className="mb-8">
            <div className="text-xl font-semibold mb-4">
              {course.courseName} / {course.courseId}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {course.classes.map((classItem, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleClassClick(course.courseId, classItem.type)
                  }
                  className={`
                    p-4 border-2 rounded-lg transition-colors text-left
                    border-gray-300 dark:border-gray-700
                    hover:border-blue-500 dark:hover:border-blue-400
                    hover:bg-blue-50 dark:hover:bg-dark-PurpleLight
                  `}
                >
                  <div className="font-medium mb-2">{classItem.type}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {getTimeString(
                      classItem.day_of_week,
                      classItem.start_time,
                      classItem.end_time
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No courses found
        </div>
      )}
    </div>
  );
}