'use client'; // Required for client-side navigation

import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { role } from "@/app/page";
import Image from "next/image";
import Link from "next/link";
import { navigateUser } from "@/lib/navigation"; // Import the utility function

// Define Action type for specific actions
type Action = "home" | "logout";

// Define the structure of menu items
const menuItems: {
  title: string;
  items: {
    icon: string;
    label: string;
    action?: Action; // Optional action field
    href?: string; // Optional href field
    visible: string[]; // Roles that can see the item
  }[];
}[] = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        action: "home",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/Lecturers.png",
        label: "Lecturers",
        href: "/lecturers",
        visible: ["admin"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/students",
        visible: ["admin"],
      },
      {
        icon: "/Courses.png",
        label: "Courses",
        href: "/courses",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/Lectures.png",
        label: "Lectures",
        href: "/lectures",
        visible: ["admin"],
      },
      {
        icon: "/Appeals.png",
        label: "Appeals",
        href: "/Appeals",
        visible: ["teacher", "student"],
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
        visible: ["teacher", "student"],
      },
      {
        icon: "/darkmode.png",
        label: "darkmode",
        action: "logout",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        action: "logout",
        visible: ["admin", "teacher", "student"],
      },
    ],
  },
];

const Menu = () => {
  const router = useRouter(); // Use useRouter for navigation

  const handleAction = (action: Action) => {
    if (action === "logout" || action === "home") {
      navigateUser(router, action, role); // Call the utility function for the given action
    }
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              const roleBasedPath = item.href ? `/${role}${item.href}` : null; // Add role to the path
  
              if (item.action) {
                // Handle items with actions (e.g., Logout, Home)
                return (
                  <button
                    key={item.label}
                    onClick={() => item.action && handleAction(item.action)}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-SkyLight"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              } else if (roleBasedPath) {
                // Handle items with links
                return (
                  <Link
                    href={roleBasedPath} // Use the role-based path
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-SkyLight"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
            }
            return null; // Return null if the item is not visible
          })}
        </div>
      ))}
    </div>
  );  
};

export default Menu;
