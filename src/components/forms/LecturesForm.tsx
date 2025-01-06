"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema validation using Zod
const schema = z.object({
  _id: z.string().optional(),
  course_id: z.string().min(1, "Course ID is required"),
  type: z.string().min(1, "Type is required"),
  day_of_week: z.string().min(1, "Day of week is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  lecturer_id: z.string().min(1, "Lecturer ID is required"),
  students_ids: z.string().min(1, "At least one student ID is required"),
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
      day_of_week: item?.day_of_week || "",
      start_time: item?.start_time || "",
      end_time: item?.end_time || "",
      lecturer_id: item?.lecturer_id || "",
      students_ids: item?.students_ids?.join(", ") || "", // Convert array to comma-separated string
    },
  });

  const onSubmit = (data: FormData) => {
    // Transform the comma-separated string into an array of trimmed strings
    const parsedStudentsIds = data.students_ids
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (parsedStudentsIds.length === 0) {
      // This check is redundant if Zod validation is correctly enforced,
      // but added here as an extra safety measure.
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
    { key: "type", label: "Type", disabled: false },
    { key: "day_of_week", label: "Day of Week", disabled: false },
    { key: "start_time", label: "Start Time", disabled: false },
    { key: "end_time", label: "End Time", disabled: false },
    { key: "lecturer_id", label: "Lecturer ID", disabled: false },
    { key: "students_ids", label: "Students IDs (comma-separated)", disabled: false },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">
        {mode === "create" ? "Create Lecture" : "Update Lecture"}
      </h2>

      {fields.map(({ key, label, disabled }) => (
        <div key={key} className="flex flex-col gap-1">
          <label htmlFor={key} className="text-sm font-medium">
            {label}
          </label>
          <input
            id={key}
            {...register(key as keyof FormData)}
            className={`border p-2 rounded ${
              errors[key as keyof FormData]
                ? "border-red-500"
                : "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }`}
            placeholder={`Enter ${label}`}
            disabled={disabled}
          />
          {errors[key as keyof FormData] && (
            <p className="text-red-500 text-sm">
              {errors[key as keyof FormData]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {mode === "create" ? "Create" : "Update"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
