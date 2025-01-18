import Menu from "@/components/Menu";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-background dark:bg-dark-background">
      {/* LEFT */}
      <div className="min-w-[80px] w-[8%] md:w-[8%] lg:w-[8%] xl:w-[10%] p-4 bg-surface dark:bg-grey-background flex flex-col items-center">
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
      <div className="min-w-[440px] w-[92%] md:w-[92%] lg:w-[92%] xl:w-[90%] bg-background dark:bg-dark-surface overflow-y-auto overflow-x-auto flex flex-col">
        {children}
      </div>
    </div>
  );
}