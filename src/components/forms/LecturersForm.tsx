"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  username: z.string().min(1),
  id: z.string().min(1),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === "update" && item?._id && (
        <input type="hidden" value={item._id} {...register("_id")} />
      )}
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          {...register("first_name")}
          className="border p-2 w-full rounded"
          placeholder="Enter first name"
        />
        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          {...register("last_name")}
          className="border p-2 w-full rounded"
          placeholder="Enter last name"
        />
        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          {...register("username")}
          className="border p-2 w-full rounded"
          placeholder="Enter username"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Lecturer ID</label>
        <input
          {...register("id")}
          className="border p-2 w-full rounded"
          placeholder="Enter lecturer ID"
          disabled={mode === "update"}
        />
        {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
      </div>
      {mode === "create" && (
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password")}
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Enter password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  )
}
