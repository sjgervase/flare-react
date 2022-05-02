import React, { useState } from "react";


// import components
import SongItem from "./SongItem";


export default function SongsList(props) {
     // get the default text for when app has been opened and no album has been selected yet

     
     // if default text exists, show only default text
     if (props.stateAlbumView == "initialState") {
          return (
               <div className="songlistIterationHolder">
                    <span>select an album on the left to view its available songs</span>
               </div>
          );
     } else {

          // function to convert duration value in seconds to standard HH:MM:SS (238.33333333333334 to .....)
          function timeFormat(durationVal) {
               // if the duration in seconds is SHORTER THAN one hour, return MM:SS
               if(durationVal < 3600) {
                    return new Date(durationVal * 1000).toISOString().substr(14, 5)
               // if the duration in seconds is LONGER THAN one hour, return HH:MM:SS
               } else {
                    return (new Date(durationVal * 1000).toISOString().substr(11, 8)).replace(/^0+/, '')
               }
          }

          // function to calculate total runtime
          function totalAlbumRuntime() {
               // empty var for total time
               let runtime = 0;

               // loop through every item in tracklist
               for (let i = 0; i < props.stateAlbumView.selectedAlbumToView.selectedAlbum.Tracklist.length; i++) {
                    runtime += props.stateAlbumView.selectedAlbumToView.selectedAlbum.Tracklist[i].Duration;          
               }
               
               return runtime;
          }


          function playbackFromPosition(position) {
               // set the album for playback at a position
               props.setSelectedAlbumForPlayback(props.stateAlbumView.selectedAlbumToView.selectedAlbum, false, position);
          }

          





           // question marks are always next to "selectedAlbumToView" as they verify the item exists
          return (
               <div className="songlistIterationHolder">
                    
                    <img
                    className="albumItemCoverimg songListAlbumCover"
                    src={props.stateAlbumView.selectedAlbumToView.selectedAlbum.CoverInBase64} />
                    
                    <div 
                    className="songListAlbumInfo">
                         
                         <span
                         className="songListAlbumTitle">
                              {props.stateAlbumView.selectedAlbumToView.selectedAlbum.AlbumName}
                         </span>

                         <span
                         className="songListAlbumYear">
                              {"(" + props.stateAlbumView.selectedAlbumToView.selectedAlbum.YearReleased + ")"}
                         </span>

                         <span
                         className="songListAlbumBy">
                              by
                         </span>

                         <span
                         className="songListAlbumArtist">
                              {props.stateAlbumView.selectedAlbumToView.selectedAlbum.AlbumArtist}
                         </span>

                         <div
                         className="songListAlbumGenres">
                              {props.stateAlbumView.selectedAlbumToView.selectedAlbum.Genre?.map(genre => 
                                   <span
                                   key={genre}>
                                        {genre}
                                   </span>
                              )}
                         </div>

                         
                         <button
                         className="btn btn-custom shadow-none"
                         onClick={() => props.setSelectedAlbumForPlayback(props.stateAlbumView.selectedAlbumToView.selectedAlbum, false)}
                         >
                              <svg className="iconInButton" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
	                              <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/>
                              </svg>
                         </button>

                         <button     
                         className="btn btn-custom shadow-none"
                         onClick={() => props.setSelectedAlbumForPlayback(props.stateAlbumView.selectedAlbumToView.selectedAlbum, true)}>
                              <svg className="iconInButton" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                   <path d="M424.1 287c-15.13-15.12-40.1-4.426-40.1 16.97V352H336L153.6 108.8C147.6 100.8 138.1 96 128 96H32C14.31 96 0 110.3 0 128s14.31 32 32 32h80l182.4 243.2C300.4 411.3 309.9 416 320 416h63.97v47.94c0 21.39 25.86 32.12 40.99 17l79.1-79.98c9.387-9.387 9.387-24.59 0-33.97L424.1 287zM336 160h47.97v48.03c0 21.39 25.87 32.09 40.1 16.97l79.1-79.98c9.387-9.391 9.385-24.59-.0013-33.97l-79.1-79.98c-15.13-15.12-40.99-4.391-40.99 17V96H320c-10.06 0-19.56 4.75-25.59 12.81L254 162.7L293.1 216L336 160zM112 352H32c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c10.06 0 19.56-4.75 25.59-12.81l40.4-53.87L154 296L112 352z"/>
                              </svg>
                         </button>

                    </div>
                    
                    {props.stateAlbumView.selectedAlbumToView.selectedAlbum.Tracklist.sort((first, second) => {
                         return first.TrackNumber.no > second.TrackNumber.no ? 1 : -1;
                    }).map(song => 
                    
                         <SongItem
                              key={song.Path}
                              path={song.Path}
                              title={song.Title}
                              number={song.TrackNumber.no}
                              duration={song.Duration}
                              liked={song.LikedSong}
                              filetype={song.FileType}
                              lossless={song.IsLossless}
                              bits={song.BitsPerSample}
                              sampleRate={song.SampleRate}
                              currentlyPlaying={props.currentlyPlayingState.song}
                              album={props.stateAlbumView.selectedAlbumToView.selectedAlbum.AlbumName}
                              artist={props.stateAlbumView.selectedAlbumToView.selectedAlbum.AlbumArtist}

                              renderingIn="AlbumsView"

                              playbackFromPosition={playbackFromPosition}

                         />
                         
                         
                    )}

                    <span 
                    className="songListAlbumRuntime">
                         total runtime: {timeFormat(totalAlbumRuntime())}
                    </span>


               </div>
          );
     }
}