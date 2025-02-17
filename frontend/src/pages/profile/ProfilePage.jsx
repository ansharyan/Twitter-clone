import React, { useRef, useState } from "react";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import { FaArrowLeft, FaLink } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { POSTS } from "../../utils/db/dummy";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import Posts from "../../components/common/Posts";
import EditProfileModal from "./EditProfileModal";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  let isLoading = false;
  let isMyProfile = true;

  const user = {
    _id: "1",
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy.png",
    coverImg: "/posts/post2.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link: "https://youtube.com/@asaprogrammer_",
    following: ["1", "2", "3"],
    followers: ["1", "2", "3"],
  };

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
  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {isLoading && <ProfileHeaderSkeleton />}
      {!isLoading && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      {!isLoading && user && (
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
                      youtube.com/@asaprogrammer_
                    </a>
                  </>
                </div>
              )}
              <div className="flex gap-1 items-center">
                <IoCalendarOutline className='w-4 h-4 text-gray-600' />
                <p className="text-gray-600">Joined July 2021</p>
              </div>
            </div>

            {/* Followers and Follwoing */}
            <div className="flex gap-2">
              <span className="flex gap-1 items-center"><p className="font-bold">{user.following.length}</p><p className="text-gray-600">Following</p></span>
              <span className="flex gap-1 items-center"><p className="font-bold">{user.followers.length}</p><p className="text-gray-600">Followers</p></span>
            </div>
            
          </div>

          {/* FeedType */}
          <div className="border-b-1 border-gray-700 flex justify-around mt-5 text-lg cursor-pointer relative">
            <div className="p-3 flex flex-col items-center w-full hover:bg-secondary transition duration-200" onClick={()=> {setFeedType("posts")}}>
              Posts
              {feedType==="posts" && (<div className="bg-primary w-15 h-1 rounded-full absolute bottom-0"></div>)}
            </div>
            <div className="p-3 flex flex-col items-center w-full text-slate-500 hover:bg-secondary transition duration-200" onClick={()=> {setFeedType("likes")}}>
              Likes
              {feedType==="likes" && (<div className="bg-primary w-15 h-1 rounded-full absolute bottom-0"></div>)}
            </div>
          </div>
          {feedType==="posts" && (<Posts/>)}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
