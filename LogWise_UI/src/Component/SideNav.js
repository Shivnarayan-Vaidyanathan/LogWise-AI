import "./SideNav.css";
import { NavLink, useLocation } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import RoofingIcon from '@mui/icons-material/Roofing';
//import React, { useEffect, useRef } from "react";
import "./SideNav.css";
//import React, { useState } from "react";
//import Switch from "@mui/material/Switch";

function SideNav({ isAdmin }) {
  const location = useLocation();

  return (
    <div className="Sidebar">
      <div className="doc-logo">
        <h2 style={{"margin-left":"22%","marginTop":"5%"}}>LogWise AI</h2>
      </div>

      <ul className="SidebarList">
       <li className="Row" id={location.pathname === "/home" ? "active" : ""}>
           <NavLink to="/home">
             <div id="icon">
               <RoofingIcon/>
             </div>
             <div id="title">Home</div>
           </NavLink>
         </li>
      </ul>

      <ul className="SidebarList">
        <li className="Row" id={location.pathname === "/chat" ? "active" : ""}>
          <NavLink to="/chat">
            <div id="icon">
              <ChatIcon></ChatIcon>
            </div>
            <div id="title">Chat</div>
          </NavLink>
        </li>

        <li className="Row-logout" id="logout">
          <NavLink to="/logout">
            <div id="icon">
              <LogoutIcon />
            </div>
            <div id="title">Logout</div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default SideNav;