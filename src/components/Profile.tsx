import React, { useState } from "react";
import { z } from "zod";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Make sure you entered Current Password"),
  newPassword: z.string().min(6, "New Password must be at least 6 characters"),
});

// Define a UserProfile interface to describe the structure of the user object.
interface UserProfile {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
}

// Define props for the Profile component.
// user: contains the profile details.
// onPasswordChange: a function that takes the old and new password and returns a Promise.
interface ProfileProps {
  user: UserProfile;
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
}

const Profile = ({ user, onPasswordChange }: ProfileProps) => {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Function to reset password input fields and clear any error message.
  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setError(null);
  };

  // Function to close the modal and reset the form.
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Handler for form submission.
  // Validates password fields using the zod schema, calls onPasswordChange,
  // and handles success or error responses.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      passwordSchema.parse({ oldPassword, newPassword });
      await onPasswordChange(oldPassword, newPassword);
      handleCloseModal();
      setSuccessMessage("Password changed successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to change password");
      }
    }
  };

  const firstName = user.first_name || user.firstName || "";
  const lastName = user.last_name || user.lastName || "";

  return (
    <div className="min-w-[200px] w-full max-w-md mx-auto p-4">
      <div className="bg-surface rounded-lg shadow dark:bg-grey-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-container">
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-dark-text">
            Profile Information
          </h2>
        </div>
        {successMessage && (
          <div className="fixed top-4 right-4 bg-Sky text-gray-800 px-4 py-3 rounded-lg shadow-lg dark:bg-dark-Sky dark:text-dark-text">
            {successMessage}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Full Name */}
          <div className="text-center pb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text">
              {firstName} {lastName}
            </h3>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1 text-center dark:text-dark-text">
                Username
              </label>
              <p className="text-gray-900 font-medium text-center dark:text-dark-text">
                {user.username}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1 text-center dark:text-dark-text">
                ID
              </label>
              <p className="text-gray-900 font-medium text-center dark:text-dark-text">
                {user.id}
              </p>
            </div>
          </div>

          {/* Change Password Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 dark:bg-dark-Sky dark:hover:bg-dark-YellowLight"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg max-w-md w-full p-6 shadow-lg dark:bg-dark-surface">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                Change Password
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500 text-xl dark:text-dark-text"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-dark-text">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-container dark:border-dark-container dark:text-dark-text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-dark-text">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-container dark:border-dark-container dark:text-dark-text"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg dark:bg-dark-container dark:text-dark-text">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 dark:bg-dark-Sky dark:hover:bg-dark-YellowLight"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200 dark:bg-dark-container dark:text-dark-text dark:hover:bg-dark-background"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;