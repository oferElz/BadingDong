"use client"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react";

type Props = {
  record: {
    _id: string
    date: string
    start_time: string
    type: string
    lecturer_id: string
    course_id: string
  }
  onClose: () => void
  onSuccess: () => void
}

type FormData = {
  appeal_reason: string
}

export default function StudentAppealForm({ record, onClose, onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const { data: session } = useSession();

  const onSubmit = async (data: FormData) => {
    try {
      const appealBody = {
        lecture_date: record.date,
        lecture_time: record.start_time,
        lecture_type: record.type,
        lecturer: record.lecturer_id,
        record_id: record._id,
        appeal_reason: data.appeal_reason,
        student_id: session?.user?.id || ""
      }
      const res = await fetch("/api/students/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appealBody),
      })
      if (!res.ok) throw new Error("Failed to create appeal")
      onSuccess()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-sm dark:text-dark-text">
      <h2 className="text-xl font-semibold dark:text-dark-text">Appeal</h2>
      <label className="flex flex-col gap-1 dark:text-dark-text">
        Reason:
        <textarea
          rows={4}
          className="bg-surface border p-2 rounded dark:bg-grey-background dark:border-dark-container dark:text-dark-text"
          {...register("appeal_reason", { required: true })}
        />
        {errors.appeal_reason && (
          <span className="text-red-500 text-xs dark:text-red-400">Appeal reason is required</span>
        )}
      </label>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded text-black dark:bg-dark-container dark:text-dark-text hover:dark:bg-grey-background"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded dark:bg-dark-Sky dark:text-dark-text dark:hover:bg-dark-SkyLight"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
