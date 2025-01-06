"use client";
import { useState } from "react";
import Image from "next/image";
import CoursesForm from "@/components/forms/CoursesForm";
import StudentForm from "@/components/forms/StudentForm"; 
import LecturesForm from "./forms/LecturesForm";

type Props = {
  mode: "create" | "update" | "delete";
  model: "courses" | "lectures"; 
  item?: any; 
  onCreate?: (data: any) => void;
  onUpdate?: (data: any) => void;
  onDelete?: (data: any) => void;
};

export default function FormModal({ mode, model, item, onCreate, onUpdate, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  const size = mode === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    mode === "create"
      ? "bg-Yellow"
      : mode === "update"
      ? "bg-Sky"
      : "bg-Purple";

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item._id);
    }
    setOpen(false);
  };


  const formMap: Record<string, JSX.Element> = {
    courses: (
      <CoursesForm
        mode={mode}
        item={item}
        onClose={() => setOpen(false)}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    ),
    lectures: (
      <LecturesForm
        mode={mode}
        item={item}
        onClose={() => setOpen(false)}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    ),
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${mode}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            {mode === "delete" && item ? (
              <div className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">
                  Are you sure you want to delete {item.name || item.id}?
                </span>
                <button
                  onClick={handleDelete}
                  className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center"
                >
                  Delete
                </button>
              </div>
            ) : (
              formMap[model] || <p>Unsupported model: {model}</p>
            )}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
