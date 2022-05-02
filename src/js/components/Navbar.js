import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { ipcRenderer } from "electron";

import flareIcon from "./imgs/flare-icon.gif";



import { useSelector } from "react-redux";


export default function Navbar() {

     // pulls data from store/index.js and puts it wherever {message} is. uses useSelector from react-redux
     // const message = useSelector(state => state.message);


     // get the current location so the view the end user is looking at is highlighted in the navbar
     const location = useLocation().pathname;
     // console.log(location);

     // send to ipcMain to close app
     function closeApp() {
          ipcRenderer.send('closeApp');
     }

     // send to ipcMain to maximize or restore app
     function maximizeOrRestoreApp() {
          ipcRenderer.send('maximizeRestoreApp');
     }

     // send to ipcMain to minimize or restore app
     function minimizeApp() {
          ipcRenderer.send('minimizeApp');
     }

     // send to ipcMain to open file picker
     function openFilePicker() {
          ipcRenderer.send('openFilePicker');
     }



     const history = useHistory();

     // <Link
     // to="/settings"
     // className={`nav-item nav-link ${location == "/settings" ? "activeNavItem": ""}`}>
     // Settings
     // </Link>


     return(
          <div className="navbar">
               

               <div className="flareIconHolder">
                    <img src={flareIcon} />
                    <span>flare</span>
               </div>

               <Link
                    to="/albumsview"
                    className={`nav-item nav-link ${location == "/albumsview" ? "activeNavItem": ""}`}>
                    Albums
               </Link>

               <Link
                    to="/songsview"
                    className={`nav-item nav-link ${location == "/songsview" ? "activeNavItem": ""}`}>
                    Songs
               </Link>

              

               <button
                    onClick={() => history.goBack()}
                    className="btn btn-custom shadow-none">
                    Back
               </button>

               <button
                    onClick={openFilePicker}
                    className="btn btn-custom shadow-none">
                    +Folder
               </button>

               <div className="navbarDraggable"></div>
          
               <div
                    onClick={minimizeApp}
                    className="windowButton nav-item">
                    <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                         <path fill="currentColor" d="M0 448C0 430.3 14.33 416 32 416H480C497.7 416 512 430.3 512 448C512 465.7 497.7 480 480 480H32C14.33 480 0 465.7 0 448z"/>
                    </svg>
               </div>

               <div
                    onClick={maximizeOrRestoreApp}
                    className="windowButton nav-item">
                    <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                         <path fill="currentColor" d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM96 96C78.33 96 64 110.3 64 128C64 145.7 78.33 160 96 160H416C433.7 160 448 145.7 448 128C448 110.3 433.7 96 416 96H96z"/>
                    </svg>
               </div>

               <div
                    onClick={closeApp}
                    className="windowButton nav-item">
                    <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                         <path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
                    </svg>
               </div>
          
          
          </div>    

     )
}
