"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema validation using Zod
const schema = z.object({
  _id: z.string().optional(), // Optional for create, required for update
  name: z.string().min(1, "Class name is required"), // Ensure name is provided
  id: z.string().min(1, "Course code is required"), // Ensure id (code) is provided
});

type FormData = z.infer<typeof schema>;

type ClassItem = {
  _id: string; // MongoDB ObjectId
  name: string; // Class name
  id: string; // Course code
};

type Props = {
  mode: "create" | "update" | "delete"; // Mode can be create or update
  item?: ClassItem; // Item to edit in update mode
  onClose: () => void; // Function to close the form
  onCreate?: (data: Omit<ClassItem, "_id">) => void; // Handler for create
  onUpdate?: (data: ClassItem) => void; // Handler for update
};

export default function CoursesForm({
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
      _id: item?._id || "", // Populate _id if item is provided
      name: item?.name || "", // Populate name if item is provided
      id: item?.id || "", // Populate id (code) if item is provided
    },
  });

  const onSubmit = (data: FormData) => {
    if (mode === "create" && onCreate) {
      onCreate({ name: data.name, id: data.id }); 
    }
    if (mode === "update" && onUpdate && data._id) {
      onUpdate({ _id: data._id, name: data.name, id: data.id }); // Include _id for update
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">
        {mode === "create" ? "Create Course" : "Update Course"}
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Class Name</label>
        <input
          id="name"
          {...register("name")}
          className="border p-2 rounded"
          placeholder="Enter class name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="id">Course Code</label>
        <input
          id="id"
          {...register("id")}
          className="border p-2 rounded"
          placeholder="Enter course code"
        />
        {errors.id && (
          <p className="text-red-500 text-sm">{errors.id.message}</p>
        )}
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {mode === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
