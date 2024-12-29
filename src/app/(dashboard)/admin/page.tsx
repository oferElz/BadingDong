import EventCalendar from "@/components/EventCalendar";
import UserCard from "@/components/UserCard";
import Image from 'next/image';


const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="w-full lg:w-1/3 rounded-lg shadow-lg overflow-hidden mx-auto hidden lg:block">
            <Image 
                src="/BadingDong.png" 
                alt="BadingDong" 
                layout="intrinsic"
                width={500}
                height={300}
                />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default AdminPage;
