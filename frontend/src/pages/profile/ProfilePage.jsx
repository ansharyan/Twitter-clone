import React, { useEffect, useRef, useState } from "react";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import { FaArrowLeft, FaLink } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { POSTS } from "../../utils/db/dummy";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import Posts from "../../components/common/Posts";
import EditProfileModal from "./EditProfileModal";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/db/date";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("userPosts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  let isMyProfile = true;
  const {username} = useParams();

  const {data:user, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
    }
  }
  })


  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(()=>{
    refetch();
  },[username,refetch])
  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      {!isLoading && !isRefetching && user && (
        <div className="flex flex-col">
          {/* header */}
          <div className="flex items-center gap-10 py-2 px-4">
            <Link to="/" className="p-2 hover:bg-gray-800 rounded-full">
              <FaArrowLeft className="w-4 h-4" />
            </Link>
            <div className="">
              <p className="text-xl font-bold">{user.fullName}</p>
              <span className="text-sm text-gray-600">
                {POSTS?.length} posts
              </span>
            </div>
          </div>

          {/* Cover Image  && Profile Image*/}
          <div className="relative group/cover">
            <img
              src={coverImg || user?.coverImg || "/cover.png"}
              alt="coverImg"
              className="w-full h-52 object-cover"
            />

            {isMyProfile && (
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
              </div>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type="file"
              hidden
              accept="image/*"
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />

            {/* Profile Image */}
            <div className="avatar absolute left-5 -bottom-16">
              <div className="rounded-full w-40 relative border-4 border-gray-900 group/avatar">
                <img
                  src={
                    profileImg ||
                    user?.profileImg ||
                    "/avatars/avatar-placeholder.png"
                  }
                  alt="profileImg"
                />

                {isMyProfile && (
                  <div
                    className="absolute top-5 right-5 rounded-full p-1 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition duration-200"
                    onClick={() => profileImgRef.current.click()}
                  >
                    <MdEdit className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Edit Button */}
          <div className="flex justify-end px-4 mt-5 gap-2">
            {isMyProfile && (<EditProfileModal/>)}
            {!isMyProfile && (
              <button className="btn bg-white text-black px-5 rounded-full">
                {" "}
                Follow
              </button>
            )}
            {(coverImg || profileImg) && (
              <button
                className="btn bg-white text-black px-5 rounded-full"
                onClick={() => alert("Profile updated successfully")}
              >
                Update
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-8 px-5">

            {/* Name UserName Bio*/}
            <div className="flex flex-col">
              <p className="font-bold text-xl text-white">{user?.fullName}</p>
              <p className="text-gray-600">@{user?.username}</p>
              <p className="mt-2">{user?.bio}</p>
            </div>

            {/* Link && Joined */}
            <div className="flex sm:gap-4 items-center flex-wrap">
              {user?.link && (
                <div className="flex gap-1 items-center ">
                  <>
                    <FaLink className="w-3 h-3 text-gray-600" />
                    <a
                      href="https://youtube.com/@asaprogrammer_"
                      target="_blank"
                      rel="noreferrer"
                      className=" text-blue-500 hover:underline"
                    >
                      {user?.link}
                    </a>
                  </>
                </div>
              )}
              <div className="flex gap-1 items-center">
                <IoCalendarOutline className='w-4 h-4 text-gray-600' />
                <p className="text-gray-600">{formatMemberSinceDate(user?.createdAt)}</p>
              </div>
            </div>

            {/* Followers and Follwoing */}
            <div className="flex gap-2">
              <span className="flex gap-1 items-center"><p className="font-bold">{user?.following.length}</p><p className="text-gray-600">Following</p></span>
              <span className="flex gap-1 items-center"><p className="font-bold">{user?.follower.length}</p><p className="text-gray-600">Followers</p></span>
            </div>
            
          </div>

          {/* FeedType */}
          <div className="border-b-1 border-gray-700 flex justify-around mt-5 text-lg cursor-pointer relative">
            <div className="p-3 flex flex-col items-center w-full hover:bg-secondary transition duration-200" onClick={()=> {setFeedType("userPosts")}}>
              Posts
              {feedType==="userPosts" && (<div className="bg-primary w-15 h-1 rounded-full absolute bottom-0"></div>)}
            </div>
            <div className="p-3 flex flex-col items-center w-full text-slate-500 hover:bg-secondary transition duration-200" onClick={()=> {setFeedType("likes")}}>
              Likes
              {feedType==="likes" && (<div className="bg-primary w-15 h-1 rounded-full absolute bottom-0"></div>)}
            </div>
          </div>
           <Posts feedType={feedType} username={username} userId={user?._id}/>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
