"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema validation using Zod
const schema = z.object({
  _id: z.string().optional(), 
  name: z.string().min(1, "Class name is required"),
  id: z.string().min(1, "Course code is required"), 
});

type FormData = z.infer<typeof schema>;

type ClassItem = {
  _id: string; 
  name: string; 
  id: string; 
};

type Props = {
  mode: "create" | "update" | "delete"; 
  item?: ClassItem; 
  onClose: () => void; 
  onCreate?: (data: Omit<ClassItem, "_id">) => void; 
  onUpdate?: (data: ClassItem) => void; 
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
      _id: item?._id || "", 
      name: item?.name || "", 
      id: item?.id || "", 
    },
  });

  const onSubmit = (data: FormData) => {
    if (mode === "create" && onCreate) {
      onCreate({ name: data.name, id: data.id }); 
    }
    if (mode === "update" && onUpdate && data._id) {
      onUpdate({ _id: data._id, name: data.name, id: data.id }); 
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
