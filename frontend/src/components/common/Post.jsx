import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const [comment, setComment] = useState("");
    const postOwner = post.user;
    const isLiked = false;
  
    const isMyPost = true;
  
    const formattedDate = "1h";
  
    const isCommenting = false;
  
    const handleDeletePost = () => {};
  
    const handlePostComment = (e) => {
        e.preventDefault();
    };
  
    const handleLikePost = () => {};

  return (
    <>
      <div className="flex p-4 gap-2 border-b border-gray-700">
        <div className="avatar">
          <Link to={""} className="w-10 h-10 rounded-full overflow-hidden">
            <img src={postOwner.profileImg} alt="PostImage" />
          </Link>
        </div>
        <div className="flex flex-col w-full gap-3">
          {/* USER PANEL */}
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Link to={""} className="font-bold">
                {postOwner.fullName}
              </Link>
              <span className="text-sm text-slate-500 flex gap-1">
                <Link className="">@{postOwner.username}</Link>
                <span>·</span>
                <span>{formattedDate}</span>
              </span>
            </div>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              </span>
            )}
            {!isMyPost && (
              <Link className="">
                <div className="hover:text-primary  text-3xl">···</div>
              </Link>
            )}
          </div>
          {/* CAPTION PANEL */}
          <div className="">
            <span>{post.text}</span>
          </div>
          {/* POST IMAGE */}
          <div className="border-1 rounded-lg border-gray-700">
            {post.img && (
              <img
                src={post.img}
                alt=""
                className="h-80 object-contain mx-auto"
              />
            )}
          </div>
          {/* LIKES PANEL */}
          <div className="flex justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImg ||
                              "/avatars/avatar-placeholder.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">
                            {comment.user.fullName}
                          </span>
                          <span className="text-gray-700 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      "Post"
                    )}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">
                0
              </span>
            </div>
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleLikePost}
            >
              {!isLiked && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
              )}
              {isLiked && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
              )}

              <span
                className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                  isLiked ? "text-pink-500" : ""
                }`}
              >
                {post.likes.length}
              </span>
            </div>
            <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer hover:text-primary' />
          </div>
        </div>
      </div>
    </>
  );
}
