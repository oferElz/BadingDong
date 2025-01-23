const AdminPage = () => {
  return (
    <div className="min-w-[250px] p-4 h-full overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-full rounded-lg p-8 bg-surface dark:bg-dark-container shadow-lg transition-colors duration-200 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-dark-text">
            Welcome to Admin Dashboard
          </h1>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <div className="p-4 bg-SkyLight dark:bg-dark-SkyLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Managing Lecturers
              </h2>
              <p className="leading-relaxed">
                As an administrator, you have complete authority over managing lecturer accounts. 
                You can add new lecturers, update their details such as first name, last name, username, and ID, or remove lecturer accounts as needed.
              </p>
            </div>

            <div className="p-4 bg-PurpleLight dark:bg-dark-PurpleLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Managing Students
              </h2>
              <p className="leading-relaxed">
                Additionally, you have full control over managing student accounts. This includes adding new students, 
                updating their information such as first name and last name, or deleting student accounts when necessary.
              </p>
            </div>

            <div className="p-4 bg-PurpleLight dark:bg-dark-PurpleLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Course Management
              </h2>
              <p className="leading-relaxed">
                Add new available courses or update existing ones by editing their name and course code.
              </p>
            </div>

            <div className="p-4 bg-YellowLight dark:bg-dark-YellowLight rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">
                Lectures Management
              </h2>
              <p className="leading-relaxed">
                View existing lectures, make updates to details such as the day of the week, start time, 
                end time, lecturer ID, and student IDs, or add new lectures to the schedule.
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

export default AdminPage;