"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema for form data
const schema = z.object({
  id: z.string().min(1, "Student ID is required").optional(), // Required for creation only
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(), // Only for creation
});

type FormData = z.infer<typeof schema>;

type Props = {
  mode: "create" | "update" | "delete";
  item?: FormData;
  onClose: () => void;
  onCreate?: (data: FormData) => void;
  onUpdate?: (data: FormData) => void;
};

export default function StudentForm({
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
    defaultValues: item || {}, // Preload data for update
  });

  const onSubmit = (data: FormData) => {
    if (mode === "create" && onCreate) {
      onCreate(data); // Handle creation
    } else if (mode === "update" && onUpdate) {
      const { id, ...updatedData } = data; // Exclude ID for updates
      onUpdate({ ...item, ...updatedData } as FormData); // Ensure `_id` remains
    }
    onClose(); // Close modal
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === "create" && (
        <div>
          <label className="block text-sm font-medium">Student ID</label>
          <input
            {...register("id")}
            className="border p-2 w-full rounded"
            placeholder="Enter student ID"
          />
          {errors.id && (
            <p className="text-red-500 text-sm">{errors.id.message}</p>
          )}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          {...register("first_name")}
          className="border p-2 w-full rounded"
          placeholder="Enter first name"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          {...register("last_name")}
          className="border p-2 w-full rounded"
          placeholder="Enter last name"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          {...register("username")}
          className="border p-2 w-full rounded"
          placeholder="Enter username"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
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
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
}
