// components/Badge.tsx
import React from 'react';

interface BadgeProps {
  text: string;
  color: string;
}

const Badge: React.FC<BadgeProps> = ({ text, color }) => {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full text-white shadow-sm whitespace-nowrap ${color}`}
    >
      {text}
    </span>
  );
};

export default Badge;