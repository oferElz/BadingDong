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
        block p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow 
        hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 
        dark:hover:bg-gray-700 
        transition transform hover:scale-105 
        ${className}
      `}
    >
      <h5 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </a>
  );
};

export default Card;
