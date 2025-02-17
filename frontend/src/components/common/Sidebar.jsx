import React from 'react'
import XSvg from '../svgs/X'
import { Link } from 'react-router-dom'
import { MdHomeFilled } from 'react-icons/md'
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

export default function Sidebar() {

    const data = {
        fullName: "John Doe",
        username: "johndoe",
        profileImg: "/avatars/boy.png",
    }

  return (
    <div className='md:flex-[2_2_0] w-20 max-w-52'>
        <div className='flex flex-col sticky top-0 left-0 md:w-full w-20 h-screen border-r border-gray-700'>
            <Link to={'/'} className='flex justify-center md:justify-start' >
                <XSvg className='px-2 w-12 h-12 fill-white rounded-full hover:bg-stone-900'/>
            </Link>
            <ul className=' flex flex-col gap-3 m-2 mt-4'>
                <li className='flex justify-center md:justify-start'>
                    <Link to={"/"} className='flex gap-3 items-center hover:bg-stone-900 transition-all duration-300 rounded-full w-full py-2 pl-2 pr-4'>
                        <MdHomeFilled className='w-7 h-7' />
                        <span className='text-lg hidden md:block'>Home</span>
                    </Link>
                </li>
                <li className='flex justify-center md:justify-start'>
                    <Link to={"/notifications"} className='flex gap-3 items-center hover:bg-stone-900 transition-all duration-300 rounded-full w-full py-2 pl-2 pr-4'>
                        <IoNotifications className='w-6 h-6' />
                        <span className='text-lg hidden md:block'>Notifications</span>
                    </Link>
                </li>
                <li className='flex justify-center md:justify-start'>
                    <Link to={`/profile/${data.username}`} className='flex gap-3 items-center hover:bg-stone-900 transition-all duration-300 rounded-full w-full py-2 pl-2 pr-4'>
                        <FaUser className='w-6 h-6' />
                        <span className='text-lg hidden md:block'>Profile</span>
                    </Link>
                </li>
            </ul>

            {data && (<Link to={`/profile/${data.username}`} className='flex gap-2 mt-auto mb-10 py-2 px-4 transition-all duration-300 hover:bg-[#181818] rounded-full'>
                <div className='avatar inline-block '>
                    <div className='w-8 rounded-full'>
                        <img src= {data?.profileImg || "/avatar-placeholder.png" }/>
                    </div>
                </div>
                <div className='flex justify-between flex-1'>
                    <div className='hidden md:block'>
                        <p className='text-md font-bold w-20 text-white truncate'>{data?.fullName || "John Doe"}</p>
                        <p className='text-sm text-slate-500'>@{data?.username || "johndoe"}</p>
                    </div>
                </div>
                <BiLogOut className='w-5 h-5 cursor-pointer hidden md:inline-block'/>
            </Link>)}
        </div>
    </div>
  )
}
