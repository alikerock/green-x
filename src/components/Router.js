import { Routes, Route } from "react-router";
import Home from "../routes/Home"
import Auth from "../routes/Auth"
import Menu from "./Nav";
import Profile from "../routes/Profile"

const Router = ({isLoggedIn, userObj})=>{  
  return(
    <>
      {isLoggedIn && <Menu />}
      <Routes>
        { isLoggedIn ? 
        <>        
          <Route path="/" element={<Home userObj={userObj}/>} />
          <Route path="/profile" element={<Profile />} />
        </>
        :
        <Route path="/" element={<Auth />} />
        }
      </Routes>
    </>
  )
}
export default Router;