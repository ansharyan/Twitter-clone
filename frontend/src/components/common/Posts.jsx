import React, { useEffect } from 'react'
import PostSkeleton from '../skeletons/PostsSkeleton'
import Post from './Post.jsx';
import { useQuery } from '@tanstack/react-query';

export default function Posts({feedType, username, userId}) {


  const getPostEndPoint = () =>{
    if(feedType === "following"){
      return "/api/posts/following";
    }else if(feedType === "userPosts"){
      return `/api/posts/user/${username}`;
    }else if(feedType === "likes"){
      return `/api/posts/likedPosts/${userId}`;
    }else {
      return "/api/posts/all";
    }
  }

  const POST_ENDPOINT = getPostEndPoint();
  const {
		data: posts,
		isLoading,
    refetch,
    isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data|| [];
			} catch (error) {
				throw new Error(error);
			}
		},
	});

  useEffect(() =>{
    refetch();
  }, [feedType, refetch])
  
  return (
    <div>
      {(isLoading || isRefetching) && (
        <>
        <PostSkeleton/>
        <PostSkeleton/>
        <PostSkeleton/>
        <PostSkeleton/>
        </>
      )}
      {!isLoading && !isRefetching && posts?.length ===0 && <p className='text-lg text-center my-4'>No posts here! Switch tab👻</p>}
      {!isLoading && !isRefetching && posts && (<div>
        {posts.map((post) => (<Post key={post._id} post={post} />))}
      </div>)}
    </div>
  )
}
