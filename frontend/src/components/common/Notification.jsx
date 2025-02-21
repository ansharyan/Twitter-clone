import React from "react";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Notification({ notification }) {
  console.log(notification);
  
  return (
    <div className="border-b border-gray-700">
      <div className="flex gap-2 p-4">
        {notification.type === "follow" && (
          <FaUser className="w-7 h-7 text-primary" />
        )}
        {notification.type === "like" && (
          <FaHeart className="w-7 h-7 text-red-500" />
        )}
        <Link to={`/profile/${notification.from.username}`}>
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={notification.from.profileImg || "/avatars/avatar-placeholder.png"}
              />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <span className="font-bold">@{notification.from.username}</span>{" "}
            {notification.type === "follow"
              ? "followed you"
              : "liked your post"}
          </div>
        </Link>
      </div>
    </div>
  );
}
