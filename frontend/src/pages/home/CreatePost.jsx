import React from "react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function CreatePost() {
  const [img, setImg] = useState(null);
  const [text, setText] = useState("");

  let isPending = false;
  let isError = false;

  const imgRef = useRef(null);

  const data = {
    profileImg: "",
  }

  const handleImgChange = (e) =>{
    const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
  }
  const handleSubmit= (e) =>{
    e.preventDefault();
    alert("Post Created!!")
  }


  return (
    <div className="flex gap-4 p-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          <img src={data.profileImg || "/avatars/avatar-placeholder.png"} alt="dp" />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="text-lg h-20 border-0 border-b resize-none border-b-primary focus:outline-none p-0"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => {setText(e.target.value)}}
        />
        
        {img && (<div className="w-72 relative mx-auto">
        <IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
          <img src={img} alt="post" className="w-full mx-auto h-72 object-contain rounded" />
        </div>)}

        <div className="flex justify-between py-4">
          <div className="flex gap-1 items-center">
            <CiImageOn className="fill-primary w-6 h-6 cursor-pointer" onClick={() => imgRef.current.click()}/>
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input accept="image/*" type='file' hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-secondary rounded-full px-4 hover:btn-primary transition-all duration-200">{isPending? "Posting": "Post"}</button>
        </div>
        {isError && (<p className="text-lg text-red-400">Something went wrong!☹</p>)}
      </form>
    </div>
  );
}
