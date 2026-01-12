"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { mockNotifications } from "@/lib/data/notifications";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationsModalProps {
  onClose?: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  onClose,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

  // Initialize notifications from localStorage or use default data
  useEffect(() => {
    const savedNotifications = localStorage.getItem('vestroll-notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      setNotifications(mockNotifications)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(
        'spherre-notifications',
        JSON.stringify(notifications),
      )
    }
  }, [notifications])

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))
    setNotifications(updatedNotifications)
  }

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length

  // TODO: Add API integration to fetch real notifications

  return (
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex items-center gap-3">
            <button
                className="text-sm text-violet-600 border hover:border-violet-600 border-violet-400
                rounded-2xl p-2 cursor-pointer transition-all"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
            >
                Mark all as read
            </button>
            <button onClick={onClose} className="ml-2 cursor-pointer group">
                <X size={20} className="group-hover:text-red-500"/>
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto notification-scrollbar">
          {notifications.map((n, idx) => (
            <div key={n.id}>
              {/* Month separator (optional) */}
              {idx === 2 && (
                <div className="text-sm text-gray-400 text-center my-2">
                  February, 2025
                </div>
              )}

              <div className="p-3 rounded-lg bg-[#F5F6F7] hover:bg-gray-50 border border-gray-100">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 flex items-center gap-1">
                      {n.title}
                      {!n.read && (
                        <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {n.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {n.message}{" "}
                    <span className="text-violet-600 cursor-pointer hover:underline">
                    ...read more
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default NotificationsModal;
