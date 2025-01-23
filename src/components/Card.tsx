"use client";
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  href?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  href = '#',
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`
        block p-4 sm:p-6 
        bg-white border border-gray-200 
        dark:bg-dark-container dark:border-gray-700 
        rounded-lg shadow 
        hover:bg-gray-100 dark:hover:bg-gray-800 
        transition transform hover:scale-105 
        ${className}
      `}
    >
      <h5 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </a>
  );
};

export default Card;