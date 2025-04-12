import React from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../../components/common/ProfileHeader";
import ProfileCard from "../../components/follow/ProfileCard";
import { useQuery } from "@tanstack/react-query";
import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton";

export default function FollowList() {
  const { username, feed } = useParams();
  
  const [feedType, setFeedType] = React.useState(feed || "following");

  const {data: users, isLoading} = useQuery({
    queryKey: ["follow", username, feedType],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/${feedType}/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data || [];
      } catch (error) {
        throw new Error(error);
      }
    },
  })
  const {data:user, isLoading:isUserLoading} = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data || null;
      } catch (error) {
        throw new Error(error);
      }
    },
  })

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/**header profile */}
        <div className="">
          <ProfileHeader user={user} page={"follow"} />
        </div>
        {/* FeedType*/}
        <div className="flex w-full border-b border-gray-700 items-center justify-around">
          <div
            className=" flex p-3 flex-col items-center mb-0.5 cursor-pointer"
            onClick={() => setFeedType("followers")}
          >
            Followers
            {feedType == "followers" && (
              <div className="bg-primary w-10 h-1 rounded-full"></div>
            )}
          </div>
          <div
            className="flex p-3 flex-col items-center mb-0.5 cursor-pointer"
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType == "following" && (
              <div className="bg-primary w-10 h-1 rounded-full"></div>
            )}
          </div>
        </div>
        {isLoading && 
           (<> <RightPanelSkeleton/>
            <RightPanelSkeleton/>
            <RightPanelSkeleton/>
            </>)
        }
        
        {users?.length == 0 && <p className="text-lg text-center mt-5">Oops! Nothing Here😣</p>}
        {users?.length>0 && users.map((user) =>(
            <ProfileCard key={user._id} user={user} />
        ))}
      </div>
    </>
  );
}
