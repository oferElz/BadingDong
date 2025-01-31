"use client";
import React from "react";

// A reusable Card component that displays a title, description.
interface CardProps {
  title: string;
  description: string;
  href?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  href = "#",
  className = "",
}) => {
  return (
    <a
      href={href}
      className={`
        block p-4 border-2 rounded-lg transition-colors text-left
        border-gray-300 dark:border-gray-700
        hover:border-blue-500 dark:hover:border-blue-400
        hover:bg-blue-50 dark:hover:bg-dark-PurpleLight
        ${className}
      `}
    >
      <h5 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
        {title}
      </h5>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </a>
  );
};

export default Card;