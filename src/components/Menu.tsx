"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Define the allowed actions for menu items
type Action = "home" | "logout" | "darkmode";

// Define the structure for menu sections and items
// Each section has a title and a list of items
// Each item has an icon, label, optional action, optional href, and an array of roles (visible) that can see it
const menuItems: {
  title: string;
  items: {
    icon: string;
    label: string;
    action?: Action;
    href?: string;
    visible: string[];
  }[];
}[] = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        action: "home",
        visible: ["admin", "lecturer", "student"],
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
        visible: ["admin", "lecturer", "student"],
      },
      {
        icon: "/class.png",
        label: "Lectures",
        href: "/lectures",
        visible: ["admin"],
      },
      {
        icon: "/Appeals.svg",
        label: "Appeals",
        href: "/appeals",
        visible: ["lecturer", "student"],
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
        visible: ["lecturer", "student"],
      },
      {
        icon: "/moon.svg", // Default icon is moon
        label: "Dark Mode", // Default label
        action: "darkmode",
        visible: ["admin", "lecturer", "student"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        action: "logout",
        visible: ["admin", "lecturer", "student"],
      },
    ],
  },
];

// Menu component renders a navigational menu based on user role and theme
const Menu = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() || "";
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Check if user has a theme preference stored
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));

    // Apply the initial theme
    document.documentElement.classList.toggle(
      "dark",
      savedTheme === "dark" || (!savedTheme && prefersDark)
    );
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Toggle the dark class on the html element
    document.documentElement.classList.toggle("dark", newDarkMode);

    // Save the preference
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const handleAction = (action: Action) => {
    if (action === "logout") {
      signOut({ callbackUrl: "/" });
    } else if (action === "home") {
      router.push(`/${userRole}`);
    } else if (action === "darkmode") {
      toggleDarkMode();
    }
  };

  // Update menuItems dynamically for dark mode label & icon
  const updatedMenuItems = menuItems.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.action === "darkmode") {
        return {
          ...item,
          label: isDarkMode ? "Light Mode" : "Dark Mode",
          icon: isDarkMode ? "/sun.svg" : "/moon.svg",
        };
      }
      return item;
    }),
  }));

  return (
    <div className="mt-4 text-sm">
      {updatedMenuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden xl:block text-gray-400 dark:text-gray-500 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(userRole)) {
              const roleBasedPath = item.href
                ? `/${userRole}${item.href}`
                : null;

              if (item.action) {
                return (
                  <button
                    key={item.label}
                    onClick={() => item.action && handleAction(item.action)}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 dark:text-gray-300 py-2 md:px-2 rounded-md hover:bg-SkyLight dark:hover:bg-dark-SkyLight"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden xl:block">{item.label}</span>
                  </button>
                );
              } else if (roleBasedPath) {
                return (
                  <Link
                    href={roleBasedPath}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 dark:text-gray-300 py-2 md:px-2 rounded-md hover:bg-SkyLight dark:hover:bg-dark-SkyLight"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden xl:block">{item.label}</span>
                  </Link>
                );
              }
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
