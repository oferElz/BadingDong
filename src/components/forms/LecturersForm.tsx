"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  first_name: z.string()
    .min(1, "First name is required")
    .regex(/^[A-Za-z\s-]+$/, "First name must contain only letters, spaces, or hyphens"),
  last_name: z.string()
    .min(1, "Last name is required")
    .regex(/^[A-Za-z\s-]+$/, "Last name must contain only letters, spaces, or hyphens"),
  username: z.string().min(1),
  id: z.string()
    .min(1, "Lecturer ID is required")
    .regex(/^\d+$/, "Lecturer ID must contain only numbers"),
  password: z.string().min(6).optional(),
  _id: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type Props = {
  mode: "create" | "update" | "delete"
  item?: FormData
  onClose: () => void
  onCreate?: (data: Omit<FormData, "_id">) => void
  onUpdate?: (data: FormData) => void
}

export default function LecturersForm({ mode, item, onClose, onCreate, onUpdate }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: item || {}
  })

  const onSubmit = (data: FormData) => {
    if (mode === "create" && onCreate) onCreate(data)
    if (mode === "update" && onUpdate) {
      const { password, ...rest } = data
      onUpdate(rest)
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-surface dark:bg-dark-surface p-4 text-black dark:text-dark-text rounded-md">
      {mode === "update" && item?._id && (
        <input type="hidden" value={item._id} {...register("_id")} />
      )}
      <div>
        <label className="block text-sm font-medium">
          First Name
        </label>
        <input
          {...register("first_name")}
          className="border p-2 w-full rounded bg-white dark:bg-dark-surface text-black dark:text-dark-text"
          placeholder="Enter first name"
        />
        {errors.first_name && <p className="text-red-500 dark:text-red-400 text-sm">{errors.first_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">
          Last Name
        </label>
        <input
          {...register("last_name")}
          className="border p-2 w-full rounded bg-white dark:bg-dark-surface text-black dark:text-dark-text"
          placeholder="Enter last name"
        />
        {errors.last_name && <p className="text-red-500 dark:text-red-400 text-sm">{errors.last_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">
          Username
        </label>
        <input
          {...register("username")}
          className="border p-2 w-full rounded bg-white dark:bg-dark-surface text-black dark:text-dark-text"
          placeholder="Enter username"
          disabled={mode === "update"}
        />
        {errors.username && <p className="text-red-500 dark:text-red-400 text-sm">{errors.username.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">
          Lecturer ID
        </label>
        <input
          {...register("id")}
          className="border p-2 w-full rounded bg-white dark:bg-dark-surface text-black dark:text-dark-text"
          placeholder="Enter lecturer ID"
          disabled={mode === "update"}
        />
        {errors.id && <p className="text-red-500 dark:text-red-400 text-sm">{errors.id.message}</p>}
      </div>
      {mode === "create" && (
        <div>
          <label className="block text-sm font-medium">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            className="border p-2 w-full rounded bg-white dark:bg-dark-surface text-black dark:text-dark-text"
            placeholder="Enter password"
          />
          {errors.password && <p className="text-red-500 dark:text-red-400 text-sm">{errors.password.message}</p>}
        </div>
      )}
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
  )
}