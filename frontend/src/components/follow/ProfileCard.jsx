import React from 'react'
import { FaRegBookmark } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

export default function ProfileCard({user}) {
  return (
    <>
    <Link to={`/profile/${user.username}`} className='flex items-center justify-between gap-4 m-4'>
        <div>
            <div className="avatar">
                <div className="w-12 rounded-full">
                    <img src={user?.profileImg || "/avatars/avatar-placeholder.png"} />
                </div>
            </div>
        </div>
        <div className='flex flex-col mr-auto'>
            <p className='font-extrabold'>{user.fullName}</p>
            <p className='text-slate-500'>@{user.username}</p>
        </div>
        <div className='btn btn-secondary rounded-full font-bold hover:text-red-600'>Following</div>
        <><div className="hover:text-primary  text-3xl">···</div></>
    </Link>
    </>
  )
}
