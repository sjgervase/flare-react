import React, { Component, useEffect, useState } from "react";

// import components
import SongsList from "../components/SongsList";
import AlbumItem from "../components/AlbumItem";





export default function AlbumsView(props) {

     return (

          <div className="AlbumsView">

               <div className="albumsList">

                    <div className="titleAndCount">
                         <h1 className="viewTitle">Albums</h1>
                         <span className="viewCount">{props.albums?.Albums.length} Albums</span>
                    </div>
                    
                    <AlbumItem 
                         stateAlbumView={props.stateAlbumView} 
                         albums={props.albums} 
                         setSelectedAlbumToView={props.setSelectedAlbumToView} 
                         setSelectedAlbumForPlayback={props.setSelectedAlbumForPlayback}

                         currentlyPlayingState={props.currentlyPlayingState}
                    />

               </div>

               <div className="songsList">
                    
                    <div className="titleAndCount">
                         <h1 className="viewTitle">Songs</h1>
                    </div>
                    
                    <SongsList 
                         stateAlbumView={props.stateAlbumView} 
                         setSelectedAlbumToView={props.setSelectedAlbumToView}
                         setSelectedAlbumForPlayback={props.setSelectedAlbumForPlayback}
                         
                         currentSong={props.currentSong}
                         currentlyPlayingState={props.currentlyPlayingState}
                    />

               </div>
               
          </div>
          
     )
}