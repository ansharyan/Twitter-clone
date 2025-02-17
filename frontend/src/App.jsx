import {Routes, Route} from "react-router-dom";
import LogIn from "./pages/auth/LogIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import NotificationPage from "./pages/notifications/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";

function App() {

  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
      <Routes>
        <Route path='/' element = {<HomePage/>} />
        <Route path="/login" element= {<LogIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/notifications" element={<NotificationPage/>}/>
        <Route path="/profile/:username" element={<ProfilePage/>}/>
      </Routes>
      <RightPanel/>

    </div>
  )
}

export default App
