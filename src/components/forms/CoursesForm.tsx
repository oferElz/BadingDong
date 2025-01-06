"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  code: z.number().min(1),
  teachers: z.string()
});

type FormData = z.infer<typeof schema>;

type ClassItem = {
  id: number;
  name: string;
  code: number;
  teachers: string[];
};

type Props = {
  mode: "create" | "update" | "delete";
  item?: ClassItem;
  onClose: () => void;
  onCreate?: (data: Omit<ClassItem, "id">) => void;
  onUpdate?: (data: ClassItem) => void;
};

export default function CoursesForm({ mode, item, onClose, onCreate, onUpdate }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: item?.id,
      name: item?.name || "",
      code: item?.code || 1,
      teachers: item?.teachers.join(", ") || "",
    },
  });

  const onSubmit = (data: FormData) => {
    const teachersArray = data.teachers
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (mode === "create" && onCreate) {
      onCreate({ name: data.name, code: data.code, teachers: teachersArray });
    }
    if (mode === "update" && onUpdate && data.id) {
      onUpdate({ id: data.id, name: data.name, code: data.code, teachers: teachersArray });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{mode === "create" ? "Create Class" : "Update Class"}</h2>
      <div className="flex flex-col gap-1">
        <label>Class Name</label>
        <input
          {...register("name")}
          className="border p-2 rounded"
          placeholder="Class name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label>Course Code</label>
        <input
          type="number"
          {...register("code", { valueAsNumber: true })}
          className="border p-2 rounded"
          placeholder="1234"
        />
        {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label>Teachers (comma-separated)</label>
        <input
          {...register("teachers")}
          className="border p-2 rounded"
          placeholder="Alice, Bob"
        />
        {errors.teachers && <p className="text-red-500 text-sm">{errors.teachers.message}</p>}
      </div>
      <button className="bg-blue-500 text-white p-2 rounded">
        {mode === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
