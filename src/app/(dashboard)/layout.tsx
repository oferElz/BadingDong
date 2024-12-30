import Menu from "@/components/Menu";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[10%] md:w-[8%] lg:w-[10%] xl:w-[10%] p-4">
        <div className="flex items-center justify-center lg:justify-start bg-transparent">
          <Image src="/BadingDong.png" alt="logo" width={200} height={200} />
        </div>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[90%] md:w-[92%] lg:w-[90%] xl:w-[90%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        {children}
      </div>
    </div>
  );
}
