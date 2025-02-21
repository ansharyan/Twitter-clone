import React from "react";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';


export default function RightPanel() {

  const {data: usersForRightPanel, isLoading} = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user/suggested");
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.message);
        } 
        
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  })

  if(usersForRightPanel?.length === 0){
    return <div className="md:w-64 w-0"></div>
  }
  
  return (
    <div className="hidden lg:block m-4 sticky top-2">
      <div className="bg-[#16181C] rounded-md p-4 border-1 border-gray-700">
        <p className="text-lg font-bold font-white">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            usersForRightPanel?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatars/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => e.preventDefault()}
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
