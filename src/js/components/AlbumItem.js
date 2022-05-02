import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Logger } from "sass";

// import components
import SongsList from "./SongsList";

export default function AlbumItem(props) {
     
     // console.log(props);

     // FOR EVENTUAL SORTING FEATURE
     // just map the albums
     // {props.albums?.Albums.map(album =>

     // sort by album artist then map
     // {props.albums.Albums.sort((a, b) => {
     //      return a.album.AlbumArtist.localeCompare(b.album.AlbumArtist);
     // }).map(album => 

     // sort by album artist then by year then map
     // {props.albums.Albums.sort((a, b) => {
     //      return a.album.AlbumArtist.localeCompare(b.album.AlbumArtist) || b.album.YearReleased - a.album.YearReleased);
     // }).map(album =>


     // let currentlyPlayingAlbum = props.currentlyPlayingSong.song?.AlbumName;
     // console.log(currentlyPlayingAlbum);

     

     if(props.albums) {
          return(
               <div className="albumIterationHolder">
     
                         {props.albums.Albums.sort((a, b) => {
                              return a.album.AlbumArtist.localeCompare(b.album.AlbumArtist) || a.album.YearReleased - b.album.YearReleased
                         }).map(album =>
                         <div 
                         key={album.album.GUID}
                         className={`albumItem ${ props.currentlyPlayingState.song?.AlbumName == album.album.AlbumName ? "currentlyPlayingAlbum": ""}`}
                         onClick={() => props.setSelectedAlbumToView(album.album)}>
     
                              <img
                              className="albumItemCoverimg"
                              src={album.album.CoverInBase64} />
     
                              <span
                              className="albumTitle">
                                   {album.album.AlbumName}
                              </span>
     
                              <span
                              className="albumArtist">
                                   {album.album.AlbumArtist}
                              </span>
     
                              
                         </div>
     
                         
                    )}
     
     
               </div>
          );
     }
}