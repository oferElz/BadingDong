"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const schema = z.object({
  _id: z.string().optional(),
  course_id: z.string().min(1, "Course ID is required"),
  type: z.string().min(1, "Type is required"),
  day_of_week: z.enum(daysOfWeek, {
    errorMap: () => ({ message: "Please select a day of the week" }),
  }),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  lecturer_id: z.string()
    .min(1, "Lecturer ID is required")
    .regex(/^\d+$/, "Lecturer ID must contain only numbers"),
  students_ids: z.string()
    .min(1, "At least one student ID is required")
    .regex(/^[\d,\s]+$/, "Student IDs must contain only numbers, commas, and spaces"),
});

type FormData = z.infer<typeof schema>;

type LectureDoc = {
  _id: string;
  course_id: string;
  type: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  lecturer_id: string;
  students_ids: string[];
};

type Props = {
  mode: "create" | "update" | "delete";
  item?: LectureDoc;
  onClose: () => void;
  onCreate?: (data: Omit<LectureDoc, "_id">) => void;
  onUpdate?: (data: LectureDoc) => void;
};

export default function LecturesForm({
  mode,
  item,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      _id: item?._id || "",
      course_id: item?.course_id || "",
      type: item?.type || "",
      day_of_week: (item?.day_of_week as typeof daysOfWeek[number]) || "",
      start_time: item?.start_time || "",
      end_time: item?.end_time || "",
      lecturer_id: item?.lecturer_id || "",
      students_ids: item?.students_ids?.join(", ") || "",
    },
  });

  const onSubmit = (data: FormData) => {
    const parsedStudentsIds = data.students_ids
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (parsedStudentsIds.length === 0) {
      return;
    }

    if (mode === "create" && onCreate) {
      onCreate({
        course_id: data.course_id,
        type: data.type,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        lecturer_id: data.lecturer_id,
        students_ids: parsedStudentsIds,
      });
    }

    if (mode === "update" && onUpdate && data._id) {
      onUpdate({
        _id: data._id,
        course_id: data.course_id,
        type: data.type,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        lecturer_id: data.lecturer_id,
        students_ids: parsedStudentsIds,
      });
    }

    onClose();
  };

  const fields = [
    { key: "course_id", label: "Course ID", disabled: mode === "update" },
    { key: "type", label: "Type", disabled: mode === "update" },
    { key: "day_of_week", label: "Day of Week", disabled: false },
    { key: "start_time", label: "Start Time", disabled: false },
    { key: "end_time", label: "End Time", disabled: false },
    { key: "lecturer_id", label: "Lecturer ID", disabled: false },
    { key: "students_ids", label: "Students IDs (comma-separated)", disabled: false },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-surface dark:bg-dark-surface p-4 text-black dark:text-dark-text rounded-md">
      <h2 className="text-xl font-bold">
        {mode === "create" ? "Create Lecture" : "Update Lecture"}
      </h2>

      {fields.map(({ key, label, disabled }) => (
        <div key={key} className="flex flex-col gap-1">
          <label htmlFor={key} className="block text-sm font-medium">
            {label}
          </label>
          {key === "day_of_week" ? (
            <select
              {...register("day_of_week")}
              className="border p-2 w-full rounded bg-white dark:bg-dark-surface text-black dark:text-dark-text"
            >
              <option value="">Select a day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={key}
              {...register(key as keyof FormData)}
              className={`border p-2 rounded bg-white dark:bg-dark-surface text-black dark:text-dark-text ${
                errors[key as keyof FormData]
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
              placeholder={`Enter ${label}`}
              disabled={disabled}
            />
          )}
          {errors[key as keyof FormData] && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors[key as keyof FormData]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="bg-gray-200 dark:bg-grey-background px-4 py-2 rounded text-black dark:text-dark-text"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-800 text-white dark:text-dark-text px-4 py-2 rounded"
        >
          {mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
}