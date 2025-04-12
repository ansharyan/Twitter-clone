import {Routes, Route, Navigate} from "react-router-dom";
import LogIn from "./pages/auth/LogIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import NotificationPage from "./pages/notifications/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import FollowList from "./pages/follow/FollowList.jsx";

import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";

import {Toaster} from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

function App() {

  const{data:authUser, isLoading, isError, error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async() =>{
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error){return null;}
        if(!res.ok){
          throw new Error(data.error || "Something went wrong!");
        }
        return data;

      } catch (error) {
        throw new Error(error.message);
      }
    },retry: 1,
  })

  if(isLoading){
    return(<div className="h-screen flex justify-center items-center">
      <LoadingSpinner/>
    </div>)
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser? <Sidebar/> : null}
      <Routes>
        <Route path='/' element = {authUser ? <HomePage/> : <Navigate to={"/login"} />} />
        <Route path="/login" element= {!authUser ? <LogIn/> : <Navigate to={"/"} />}/>
        <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to={"/"} />}/>
        <Route path="/notifications" element={authUser ? <NotificationPage/> : <Navigate to={"/login"} />}/>
        <Route path="/profile/:username/" element={authUser ? <ProfilePage/> : <Navigate to={"/login"} />}/>
        <Route path="/follow/:username/:feed" element={authUser ? <FollowList/> : <Navigate to={"/login"} />}/>
      </Routes>
      {authUser? <RightPanel/> : null}
      <Toaster/>
    </div>
  )
}

export default App
