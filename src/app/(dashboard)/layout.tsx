import Menu from "@/components/Menu";
import Image from "next/image";

// This layout component structures the dashboard page into two main sections:
// A left sidebar containing a logo and navigational Menu
// A main content area on the right that displays children content
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
      <div className="flex-1 flex flex-col bg-background dark:bg-dark-surface overflow-y-auto overflow-x-auto">
        {children}
      </div>
    </div>
  );
}