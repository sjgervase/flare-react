import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { ipcRenderer } from "electron";

// import actions
import { fetchMusic } from "./actions/musicLibrary";

// import components
import PlayerControls from "./components/PlayerControls";

// import views
import AlbumsView from  "./views/AlbumsView";
import SongsView from  "./views/SongsView";
import Settings from  "./views/Settings";


import {
     Switch,
     Route
} from "react-router-dom";


// container exists as provider store must be a parent of the component using dispatch
export default function Container() {

     // react redux stuff 
     // all albums
     const albums = useSelector(({albums}) => albums.items);

     const dispatch = useDispatch();


     // fetch library on load, then every 3 seconds.
     useEffect(() => {
          dispatch(fetchMusic());

          setInterval(() => {
               console.log("fetching");
               dispatch(fetchMusic());
          }, 3000)

     }, [dispatch]);


     // State for which album is currently being viewed
     const [stateAlbumView, setStateAlbumView] = useState("initialState");

     const setSelectedAlbumToView = (selectedAlbum) => {
          setStateAlbumView({
               selectedAlbumToView: {
                    selectedAlbum
               }
          });
     }


     // State for which album is currently being played
     const [stateAlbumPlayback, setStateAlbumPlayback] = useState("initialState");

     const setSelectedAlbumForPlayback = (selectedAlbum, shuffleBool, playbackPosition) => {
          // shuffle param is either true or false
          
          // if the shuffle button is clicked, the shuffle param will not be undefined. 
          // randomize the tracklist order then setStateAlbumPlayback

          setStateAlbumPlayback({
               selectedAlbumForPlayback:{
                    selectedAlbum,
                    shuffle: shuffleBool,
                    position: playbackPosition
               }
          });
     }


     // state for the currently playing song. this ensures that the currently playing song is highlighted in all lists
     const [currentlyPlayingState, setCurrentlyPlayingState] = useState("initialState");

     const currentSong = (song) => {
          
          setCurrentlyPlayingState({
               song
          })
     }

     // state for when playing all songs from songsview, either alphabetically or shuffled
     const [stateAllSongsPlayback, setStateAllSongsPlayback] = useState("initialState");

     const playTheSongs = (allSongs, index) => {

          setStateAllSongsPlayback({
               allSongs,
               index
          })
     }


     
     // Add listeners for standard media keys
     // TODO
     document.addEventListener('keyup', ({ key }) => { 
          const mediaKey = [
          'MediaTrackNext', 
          'MediaTrackPrevious', 
          'MediaPlayPause', 
          'MediaStop'].includes(key)   

          mediaKey && console.log(key)
     });


     // default path is always last 
     return(
          <div className="container">

               <div className="contentColumn">
                    <Switch>

                         <Route path="/settings">
                              <Settings/>
                         </Route>

                         <Route path="/songsview">
                              <SongsView
                                   albums={albums} 
                                   stateAlbumView={stateAlbumView}
                                   
                                   currentSong={currentSong}
                                   currentlyPlayingState={currentlyPlayingState}

                                   playTheSongs={playTheSongs}
                              />
                         </Route>

                         <Route path="/">
                              <AlbumsView 
                                   albums={albums} 
                                   stateAlbumView={stateAlbumView} 
                                   setSelectedAlbumToView={setSelectedAlbumToView} 
                                   setSelectedAlbumForPlayback={setSelectedAlbumForPlayback}
                                   
                                   currentSong={currentSong}
                                   currentlyPlayingState={currentlyPlayingState}
                              />
                         </Route>

                    </Switch>
               </div>

               <PlayerControls
                    albums={albums}

                    stateAlbumPlayback={stateAlbumPlayback}
                    stateAllSongsPlayback={stateAllSongsPlayback}

                    currentSong={currentSong}
                    currentlyPlayingState={currentlyPlayingState}
               />
                              
          </div>
     )
}