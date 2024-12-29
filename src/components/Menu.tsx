'use client'; // Required for client-side navigation

import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { navigateUser } from "@/lib/navigation"; // Import the utility function

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        action: "home", // Usecase for navigation
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        action: "logout", // Usecase for navigation
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const router = useRouter(); // Use useRouter for navigation

  const handleAction = (action) => {
    if (action === "logout" || action === "home") {
      navigateUser(router, action, role); // Call the utility function for the given action
    }
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              if (item.action) {
                // Handle items with actions (e.g., Logout, Home)
                return (
                  <button
                    key={item.label}
                    onClick={() => handleAction(item.action)}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              } else if (item.href) {
                // Handle items with links
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;