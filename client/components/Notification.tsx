'use client';

import { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg">
      <p>{message}</p>
    </div>
  );
};

export default Notification;
