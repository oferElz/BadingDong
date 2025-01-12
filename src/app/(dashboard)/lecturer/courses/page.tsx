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
  }, []);

  const handleClassClick = (courseId: string, type: string) => {
    router.push(`/lecturer/courses/${courseId}/records?type=${type}`);
  };

  const getTimeString = (day: string, start: string, end: string) => {
    return `${day}: ${start} - ${end}`;
  };

  return (
    <div className="p-6">
      {Array.isArray(courses) &&
        courses.map(
          (
            course // Added Array.isArray check
          ) => (
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
                    className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 
                          hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-medium mb-2">{classItem.type}</div>
                    <div className="text-sm text-gray-600">
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
          )
        )}

      {(!courses || courses.length === 0) && (
        <div className="text-center text-gray-500 mt-8">No courses found</div>
      )}
    </div>
  );
}
