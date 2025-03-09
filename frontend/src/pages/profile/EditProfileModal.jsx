import React, { useEffect } from "react";
import { useState } from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import useUpdateProfile from "../../hooks/useUpdateProfile";

export default function EditProfileModal({authUser}) {
  const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link:  "",
		newPassword: "",
		currentPassword: "",
	});

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: ""
			});
		}
	}, [authUser]);

  const handleInputChange = (e) =>{
    setFormData ({...formData, [e.target.name]:[e.target.value]});
  }

  const {updateProfile, isUpdating} = useUpdateProfile();
  const handleUpdateProfile= async(e) =>{
	e.preventDefault();
	if(isUpdating) return;
	formData.bio = formData.bio.toString() || "";
	formData.link = formData.link.toString() || "";
	formData.newPassword = formData.newPassword.toString() || "";
	formData.currentPassword = formData.currentPassword.toString() || "";
	await updateProfile(formData);
  }

  return (
    <div className="">
      <button
        className="btn btn-secondary rounded-full px-5"
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Edit Profile
      </button>
      <dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box w-1/2 max-w-5xl border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={handleUpdateProfile}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md focus:input-primary'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md focus:input-primary'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md focus:input-primary'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md focus:input-primary'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md focus:input-primary'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md focus:input-primary'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='w-full input border border-gray-700 rounded p-2 input-md focus:input-primary'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>{isUpdating? <LoadingSpinner size="sm"/>:"Update"}</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>Close</button>
				</form>
			</dialog>
    </div>
  );
}
