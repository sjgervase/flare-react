import React, { useState } from "react";

import { ipcRenderer } from "electron";


export default function SongItem(props) {

     // console.log(props);

     
     // Song information 

     // function to modify tracknumber so it is always 2 digits (01 instead of 1)
     function normalizeTrackNumber(tracknumberVal) {
          if (tracknumberVal < 100) {
               return ("00"+tracknumberVal).slice(-2);     
          
          } else if (tracknumberVal < 1000) {
               return ("00"+tracknumberVal).slice(-3);     
          
          } else if (tracknumberVal < 10000) {
               return ("00"+tracknumberVal).slice(-4);     
          }
          
     }

     // function to display full heart or empty heart based on songLiked property
     function isItLiked(likedBool) {


          if (likedBool) {
               return(
                    <svg className="likedTrue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                         <path fill="currentColor" d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"/>
                    </svg>
               );
          } else {
               return(
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                         <path fill="currentColor" d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/>
                    </svg>
               );
          }
     }

     // function to format filetype (FLAC to .flac)
     function formatFileType(filetypeVal) {
          return "."+filetypeVal.toLowerCase()
     }

     // function to format lossless boolean (true to lossless)
     function isItLossless(losslessVal) {
          if(losslessVal) {
               return "lossless";
          }
     }

     // function to convert duration value in seconds to standard HH:MM:SS (238.33333333333334s to .....)
     function timeFormat(durationVal) {
          // if the duration in seconds is SHORTER THAN one hour, return MM:SS
          if(durationVal < 3600) {
               return new Date(durationVal * 1000).toISOString().substr(14, 5)
          // if the duration in seconds is LONGER THAN one hour, return HH:MM:SS
          } else {
               return (new Date(durationVal * 1000).toISOString().substr(11, 8)).replace(/^0+/, '')
          }
     }

     // function to format sound quality data (24 44100 to 24-bit/44.1k Hz)
     function formatSoundQuality(bits, rate) {
          return (bits + "-bit/" + (rate/1000) + " kHz");
     }





     // set state for song item for display changes when metadata is changed
     const [songItemState, setSongItemState] = useState({
          title: props.title,
          trackNumber: normalizeTrackNumber(),
          isItLiked: props.liked,
          album: props.album,
          artist: props.artist
     });




     // playback information

     // if the song that is currently playing is equal to the path of this song item, add a css class
     let currentlyPlayingSong = false

     if (props.currentlyPlaying?.Path == props.path) {
          currentlyPlayingSong = true;
     }


     // determine the view in which the song item is rendering in as this component is used in multiple views
     function parentView() {
          if (props.renderingIn == "SongsView") {
               return "songsViewSongItem"
          } else {
               return "albumsViewSongItem"
          }
     }

     // if in songsview, show additional information that would not be present otherwise
     function songsViewAdditionalInfo() {
          if (props.renderingIn == "SongsView") {
               return(
                    <div
                    className="songsViewAdditionalInfo">
                         <span 
                         className="songItemSongArtist">
                              {props.artist}
                         </span>

                         <span className="textSeparator">•</span>
     
                         <span 
                         className="songItemSongAlbum">
                              {props.album}
                         </span>

                         <span 
                         className="songItemSongYear">
                              ({props.year})
                         </span>
                    </div>
               );
          }
     }


     // set the current playback of the clicked on song
     const setplayback = () => {

          if (props.renderingIn == "SongsView") {
               props.songsViewPlayback(props.number)
          } else {
               props.playbackFromPosition(props.number)
          }
     }


     // change like status but do not play the song
     const changeLikedVal = (e) => {     
          // this stop playback of the song
          e.stopPropagation()

          // console.log(props.path);

          // create a var for liking vs not liking
          let newLikedVal = !songItemState.isItLiked;

          setSongItemState({
               title: props.title,
               trackNumber: normalizeTrackNumber(),
               isItLiked: newLikedVal,
               album: props.album,
               artist: props.artist
          })

          // change isItLiked to true
          

          // console.log(props.album);

          ipcRenderer.invoke('changeMetaData', (["like", props.path, props.album, props.liked]));

     }

     // console.log(songItemState);

     
     // the below classname is conditional 
     return(
          <div
          className={`songItem ${parentView()} ${currentlyPlayingSong ? "currentlyPlayingSong": ""}`}

          onClick={() => setplayback(props.number)}>

               <div
               className="primarySongInfo">
                    
                    <span 
                    className="songItemSongTrackNumber">
                         {normalizeTrackNumber(props.number)}
                    </span>

                    <span 
                    className="songItemSongTitle">
                         {props.title}
                    </span>

                    <span 
                    className="songItemSongDuration">
                         {timeFormat(props.duration)}
                    </span>

               </div>

               <div
               className="secondarySongInfo">

                    <span 
                    className="songItemSongLikedSong"
                    onClick={(e) => changeLikedVal(e)}>

                         {isItLiked(songItemState.isItLiked)}
                    </span>

                    {songsViewAdditionalInfo()}

                    <span 
                    className="songItemSongFileType">
                         {formatFileType(props.filetype)}
                    </span>

                    <span className="textSeparator">•</span>

                    <span 
                    className="songItemSongIsLossless">
                         {isItLossless(props.lossless)}
                    </span>

                    <span className="textSeparator">•</span>

                    <span 
                    className="songItemSongSoundQuality">
                         {formatSoundQuality(props.bits, props.sampleRate)}
                    </span>

               </div>


          </div>
     );

}





