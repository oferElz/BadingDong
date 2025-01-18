const LecturerPage = () => {
  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="w-full h-full flex flex-col ">
        <div className="w-full h-full rounded-lg p-8 bg-surface dark:bg-dark-container shadow-lg transition-colors duration-200 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-dark-text">
            Welcome to Lecturer Dashboard
          </h1>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <div className="p-4 bg-SkyLight dark:bg-dark-SkyLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Courses tab
              </h2>
              <p className="leading-relaxed">
              As a Lecturer, you can view the courses you teach categorized by course type, day of the week, and time. Additionally, 
              you can see the assigned students for each selected course and update their attendance status from &apos;missed&apos; to &apos;attended&apos;.
              </p>
            </div>

            <div className="p-4 bg-PurpleLight dark:bg-dark-PurpleLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Appeals tab
              </h2>
              <p className="leading-relaxed">
              You can also review any pending appeals for the courses you teach, which include details such as the date, time, lecture type, 
              student ID, and the appeal reason. Each appeal can be approved or declined by selecting the corresponding button.
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

export default LecturerPage;
