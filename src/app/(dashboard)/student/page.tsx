const StudentPage = () => {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="w-full h-full flex flex-col ">
        <div className="w-full h-full rounded-lg p-8 bg-surface dark:bg-dark-container shadow-lg transition-colors duration-200 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-dark-text">
            Welcome to Student Dashboard
          </h1>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <div className="p-4 bg-SkyLight dark:bg-dark-SkyLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Courses tab
              </h2>
              <p className="leading-relaxed">
              As a Student, you can view courses attendence records, the courses are categorized by course id, course name and type.
              Whithin each course, you can view all of your course records, Attendence Percentage graph, Attendance Overview graph and Appeals Sent summary
              Additionally, you can see navigate your Attendence Percentage graph by the type of course you wish to present.
              </p>
            </div>

            <div className="p-4 bg-PurpleLight dark:bg-dark-PurpleLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Appeals tab
              </h2>
              <p className="leading-relaxed">
              You can also review all Appealable Records, all relevant records would appear for the courses you learn, each record include details such as the date, course id, type, time and day.
              Each record have a Action column, which will present &apos;Appeal&apos; if that record is appealable, or &apos;Already Appealed&apos; if you already submited an appeal for that record.
              by pressing &apos;Appeal&apos; button, you can add a reason for the appeal.
              </p>
            </div>

            <div className="p-4 bg-YellowLight dark:bg-dark-YellowLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Profile tab
              </h2>
              <p className="leading-relaxed">
              Here, you can view your personal information, including your full name, username, and ID. 
              Additionally, you can update your password by selecting the &apos;Change Password&apos; option.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-grey-background rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Quick Tips
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Use the sidebar menu to navigate between different sections</li>
                <li>You can return to your home page from each section by pressing &apos;home&apos; button</li>
                <li>On the bottom corner of the sidebar you can toggle dark&#92;light mode</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
