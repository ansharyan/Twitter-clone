import React from 'react'
import PostSkeleton from '../skeletons/PostsSkeleton'
import {POSTS} from "../../utils/db/dummy.js";
import Post from './Post.jsx';

export default function Posts() {

  let isLoading = false;
  
  return (
    <div>
      {isLoading && (
        <>
        <PostSkeleton/>
        <PostSkeleton/>
        <PostSkeleton/>
        <PostSkeleton/>
        </>
      )}
      {!isLoading && POSTS.length ===0 && <p className='text-lg  mx-2 my-4'>No posts here!</p>}
      {!isLoading && POSTS && (<div>
        {POSTS.map((post) => (<Post key={post._id} post={post} />))}
      </div>)}
    </div>
  )
}
