import Menu from "@/components/Menu";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex bg-background dark:bg-dark-background">
      {/* LEFT */}
      <div className="w-[10%] md:w-[8%] lg:w-[10%] xl:w-[10%] p-4 bg-surface dark:bg-grey-background">
        <div className="flex items-center justify-center lg:justify-start bg-transparent">
          <Image 
            src="/BadingDong.png" 
            alt="logo" 
            width={200} 
            height={200}
          />
        </div>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[90%] md:w-[92%] lg:w-[90%] xl:w-[90%] bg-background dark:bg-dark-surface overflow-scroll flex flex-col">
        {children}
      </div>
    </div>
  );
}