import Image from 'next/image';


const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* MIDDLE CHARTS */}
        <div className="w-full lg:w-1/3 rounded-lg overflow-hidden mx-auto hidden lg:block bg-transparent">
            <Image 
                src="/BadingDong.png" 
                alt="BadingDong" 
                layout="intrinsic"
                width={500}
                height={300}
                />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
