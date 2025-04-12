import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { POSTS } from '../../utils/db/dummy'


export default function ProfileHeader({user, page}) {
  let navigate = useNavigate();
  return (
    <div className="flex items-center gap-10 py-2 px-4">
            <div className="p-2 hover:bg-gray-800 rounded-full cursor-pointer" onClick={() => navigate(-1)}>
              <FaArrowLeft className="w-4 h-4" />
            </div>
            <div className="">
              <p className="text-xl font-bold">{user?.fullName}</p>
              {page == "follow" && 
              <span className="text-sm text-gray-600">
                @{user?.username}
              </span>
              }

              {page == "profile" &&
              <span className="text-sm text-gray-600">
                {POSTS?.length} posts
              </span>
              }
            </div>
          </div>
  )
}
