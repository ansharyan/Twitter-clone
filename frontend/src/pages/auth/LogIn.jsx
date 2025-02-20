import React, { useState } from "react";
import XSvg from "../../components/svgs/X";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LogIn = () => {

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    password: "",
    username: ""
  })

  const {mutate, isPending, isError ,error} = useMutation({
    mutationFn: async ({username, password}) =>{
      try {
        const res = await fetch("/api/auth/login", {
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({password, username}),
        });

        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw error;
      }
    }, onSuccess: () =>{
      queryClient.invalidateQueries({queryKey: ["authUser"]});
      toast.success("Logged In Successfully😊");
    }
  })

  const handleInputChange = (e) =>{
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSignIn = (e) => {
    e.preventDefault();
    mutate(formData);
  }


  return (
    <div className="flex max-w-screen-xl mx-auto h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white " />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <form className="lg:w-2/3 md:mx-20 mx-auto gap-4 flex flex-col">
          <h1 className="text-4xl font-extrabold text-white">Let's Go!</h1>
          <XSvg className="w-20 lg:hidden fill-white" />
          <label className="input input-bordered rounded flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" className="grow" placeholder="Username" name="username" value={formData.username} onChange={handleInputChange} />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input type="password" className="grow" placeholder="Password" name="password" value={formData.password}  onChange={handleInputChange}/>
          </label>
          <button className="btn btn-primary rounded-full" onClick={handleSignIn}> {isPending? "Logging" : "Log In"}</button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col  lg:w-2/3 md:mx-20 gap-2 mt-4">
          <p>Don't have an account?</p>
          <Link to='/signup'>
            <button className="btn btn-primary rounded-full w-full btn-outline text-white">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
