"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  id: z.string().min(1, "Lecturer ID is required"),
  _id: z.string().optional(), // Include _id for updates, but it's optional
});

type FormData = z.infer<typeof schema>;

type Props = {
  mode: "create" | "update" | "delete";
  item?: FormData;
  onClose: () => void;
  onCreate?: (data: Omit<FormData, "_id">) => void;
  onUpdate?: (data: FormData) => void;
};

export default function LecturersForm({ mode, item, onClose, onCreate, onUpdate }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: item || {}, // Default values based on the item
  });

  const onSubmit = (data: FormData) => {
    if (mode === "create" && onCreate) {
      onCreate(data); // Exclude `_id` for creation
    }
    if (mode === "update" && onUpdate) {
      onUpdate(data); // Include `_id` for updates
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === "update" && item?._id && (
        <input
          type="hidden"
          value={item._id} // Pass `_id` for updates
          {...register("_id")}
        />
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
        />
        {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
}
