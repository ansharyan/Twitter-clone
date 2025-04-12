import React, { useEffect, useRef, useState } from "react";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import { FaArrowLeft, FaLink } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
// import { POSTS } from "../../utils/db/dummy";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import Posts from "../../components/common/Posts";
import EditProfileModal from "./EditProfileModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/db/date";
import useFollow from "../../hooks/useFollow";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { set } from "mongoose";
import ProfileHeader from "../../components/common/ProfileHeader";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("userPosts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const {username} = useParams();

  const {follow, isPending} = useFollow();
  const {updateProfile, isUpdating} = useUpdateProfile();

  const {data:user, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ["profileUser"],
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
  const {data:authUser} = useQuery({queryKey: ["authUser"]})

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

  const handleImageUpdate= async(e) =>{
    if(isUpdating) return;
    await updateProfile({coverImg, profileImg});
    setCoverImg(null);
    setProfileImg(null);
  }

  useEffect(()=>{
    refetch();
  },[username,refetch])


  const isMyProfile = authUser?.username === username;
  const follows = authUser?.following.includes(user?._id);

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      {!isLoading && !isRefetching && user && (
        <div className="flex flex-col">
          {/* header */}
          <ProfileHeader user={user} page="profile" />

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
          {/* Edit Button and Follow*/}
          <div className="flex justify-end px-4 mt-5 gap-2">
            {isMyProfile && (<EditProfileModal authUser={authUser}/>)}
            {!isMyProfile && (
              <button className="btn bg-white text-black px-5 rounded-full" onClick={() =>{
                follow(user._id);
              }}>
                {isPending && <LoadingSpinner size="sm"/>}
                {!isPending && follows && "Unfollow"}
                {!isPending && !follows && "Follow"}
              </button>
            )}
            {(coverImg || profileImg) && (
              <button
                className="btn bg-white text-black px-5 rounded-full"
                onClick={handleImageUpdate}
              >
                {isUpdating? "Updating" :"Update"}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-8 px-5">

            {/* Name UserName Bio*/}
            <div className="flex flex-col">
              <p className="font-bold text-xl text-white">{user?.fullName}</p>
              <p className="text-gray-600">@{user?.username}</p>
              <p className="mt-2 whitespace-pre-wrap" >{user?.bio}</p>
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
              <Link to={`/follow/${username}/following`} className="flex gap-1 items-center hover:underline cursor-pointer"><p className="font-bold">{user?.following.length}</p><p className="text-gray-600">Following</p></Link>
              <Link to={`/follow/${username}/followers`} className="flex gap-1 items-center hover:underline cursor-pointer"><p className="font-bold">{user?.follower.length}</p><p className="text-gray-600">Followers</p></Link>
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
