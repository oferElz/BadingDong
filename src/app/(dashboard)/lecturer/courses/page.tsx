"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CourseClass {
  type: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  student_ids: string[];
}

interface Course {
  courseId: string;
  courseName: string;
  classes: CourseClass[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

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

    fetchCourses();
  }, [userId]);

  const handleClassClick = (courseId: string, type: string) => {
    router.push(`/lecturer/courses/${courseId}/records?type=${type}`);
  };

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