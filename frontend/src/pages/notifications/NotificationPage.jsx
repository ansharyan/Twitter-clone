import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Notification from "../../components/common/Notification";

export default function NotificationPage() {
  const isLoading = false;

  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl.png",
      },
      type: "like",
    },
  ];

  const deleteNotifications = () => {
    alert("All Notifications Deleted!");
  };
  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <p className="font-bold text-xl text-white">Notifications</p>
        <div className="dropdown hover:cursor-pointer">
          <div
            tabIndex={0}
            role="button"
            className="m-1 rounded-full hover:bg-gray-800 p-2"
          >
            <IoSettingsOutline className="w-5 h-5" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={deleteNotifications}>Delete all notifications</a>
            </li>
          </ul>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
      {notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications 🤔</div>
      )}
      {notifications?.map((notification) =><Notification key={notification._id} notification={notification}/>)}
    </div>
  );
}
