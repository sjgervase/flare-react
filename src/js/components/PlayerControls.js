import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {Howl, Howler} from 'howler';


// import components
import ProgressBar from './ProgressBar';

export default function PlayerControls(props) {

     // FOR STANDARD OR SHUFFLED PLAYBACK OF AN ALBUM ------------------------------------------------------

     // State of the queue. this is an object with:
          // album name
          // album artist
          // tracklist, an array of song objects
          // album cover,
          // a playback position
     const [queueState, setQueueState] = useState("initialState");

     // state for the current song that is playing. this is a song object with:
          // Howler functionality
          // song title
          // song artist
          // song path
          // Album cover
     const [playMe, setPlayMe] = useState("initialState");


     // if an album in albumsview has been clicked on, this component will recieve that prop.
     // this sets the queueState
          // with an optional shuffle of the tracklist if end user clicks shuffle button
          // with an optional position if end user clicks a song in the album rather than the play button or first song
     useEffect(() => {
          if (props.stateAlbumPlayback != "initialState") {
               // set the tracklist of the selected album to var tracklistArray so code can be read easier
               var tracklistArray = props.stateAlbumPlayback.selectedAlbumForPlayback.selectedAlbum.Tracklist;

               // check if shuffle was clicked, randomize the tracklist array
               if (props.stateAlbumPlayback.selectedAlbumForPlayback.shuffle) {
                    console.log("shuffle");
                    // fisher yates method of randomizing
                    function shuffleTracklist(array){
                         for (let i = 0; i < array.length; i++) {
                              let j = Math.floor(Math.random() * i);
                              let k = array[i];
                              array[i] = array[j]
                              array[j] = k;
                         }
                         return array;
                    }
                    // apply above shuffle function to the tracklist array
                    shuffleTracklist(tracklistArray);
               }
               // actually set the queue state
               setQueueState({
                    AlbumArtist: props.stateAlbumPlayback.selectedAlbumForPlayback.selectedAlbum.AlbumArtist,
                    AlbumName: props.stateAlbumPlayback.selectedAlbumForPlayback.selectedAlbum.AlbumName,
                    Tracklist: tracklistArray,
                    Cover: props.stateAlbumPlayback.selectedAlbumForPlayback.selectedAlbum.CoverInBase64,
                    playFromPosition: props.stateAlbumPlayback.selectedAlbumForPlayback.selectedAlbum.position
               })
          }
     }, [props.stateAlbumPlayback])


     // When the queueState is set in the above useEffect, a playMe is determined
          // if a playMe already exists, 
               // this will find the index of that song within the standard or shuffled tracklist
               // find the next song to be played 
               // ALSO, if there is no next song, the album is finished
          // if a playMe does not already exist, it will play the first song
          // sets a property called "playingAllSongs" equal to false to show that we will simply iterate through the same album
     useEffect(() => {
          if (queueState != "initialState") {
               
               // the src property of the song that just played, undefined if no song was just playing
               var justPlayed = playMe.howl?._src;

               // will return -1 if justPlayed is undefined
               var justPlayedIndex = queueState.Tracklist.findIndex((obj => obj.Path == justPlayed));

               // stop playback of whatever is playing, if something is playing
               playMe.howl?.stop();

               // add one to the index to get the next song in the tracklist
               var playThisIndex = justPlayedIndex + 1;

               // if a position property has been set, set playThisIndex equal to that position minus 1 (index vs track number)
               if(props.stateAlbumPlayback.selectedAlbumForPlayback.position) {
                    playThisIndex = props.stateAlbumPlayback.selectedAlbumForPlayback.position - 1;
               }

               // set the state for play / pause button icon
               setPausePlayButton('pause');

               // if index of the next song to play is equal to the length of the tracklist, then is not a subsequent song to play and the album is finished
               if (playThisIndex == queueState.Tracklist.length) {
                    console.log("album is finished");
               } else {
                    // else, there is another song
                    setPlayMe({
                         playingAllSongs: false,
                         howl: new Howl({
                              src: queueState.Tracklist[playThisIndex].Path
                         }),
                         Path: queueState.Tracklist[playThisIndex].Path,
                         Title: queueState.Tracklist[playThisIndex].Title,
                         AlbumArtist: queueState.AlbumArtist,
                         AlbumName: queueState.AlbumName,
                         Cover: queueState.Cover
                    })
               }
          }
     }, [queueState]);


     // When a playMe is created in the above useEffect, 
          // play the playMe (song)
          // set the currentSong to this song. this allows the currently playing song to be highlighted in menus
     useEffect(() => {
          if (playMe != "initialState") {
               playMe.howl.play();
               // playMe.howl.rate(5);
               // set the currently playing state
               props.currentSong(playMe)
          }
     }, [playMe])


    



     // FOR STANDARD OR SHUFFLED PLAYBACK OF ALL SONGS ------------------------------------------------------
     
     // state for holding all songs and the current index
     const [allSongsPlaybackState, setAllSongsPlaybackState] = useState("initialState");

     
     // when songs are recieved
     useEffect(() =>{
          if (props.stateAllSongsPlayback != "initialState") {
               
               setAllSongsPlaybackState({
                    allSongs: props.stateAllSongsPlayback.allSongs,
                    index: props.stateAllSongsPlayback.index
               })

          }
     }, [props.stateAllSongsPlayback])


     // when playback state is created, create playmeAll for all songs
     // sets a property called "playingAllSongs" equal to true to show that we will be playing different albums and metadata must be grabbed
     useEffect(() =>{
          if (allSongsPlaybackState != "initialState") {
               
               // console.log(allSongsPlaybackState);

               // find cover
               // console.log(props.albums);
               let thisSongsAlbum = props.albums.Albums.find(album => album.album.AlbumName == allSongsPlaybackState.allSongs[allSongsPlaybackState.index].albumName)
               // console.log(thisSongsAlbum);

               setPlayMe({
                    playingAllSongs: true,
                    howl: new Howl({
                         src: allSongsPlaybackState.allSongs[allSongsPlaybackState.index].Path
                    }),
                    Path: allSongsPlaybackState.allSongs[allSongsPlaybackState.index].Path,
                    Title: allSongsPlaybackState.allSongs[allSongsPlaybackState.index].Title,
                    AlbumArtist: allSongsPlaybackState.allSongs[allSongsPlaybackState.index].artist,
                    AlbumName: allSongsPlaybackState.allSongs[allSongsPlaybackState.index].albumName,
                    Cover: thisSongsAlbum.album.CoverInBase64
               })
              
          }
     }, [allSongsPlaybackState])


     // SONG END --------------------------------------------------------------------------------------------
     // howler.js functionality for a listener for the end of the song
          // gets the current index of the song playing,
          // sets the next index
          // creates a new playMe, continuing the automatic playback
     playMe.howl?.on('end', function(){
          // console.log('Finished!');


          // all songs are being played
          if (playMe.playingAllSongs) {
               // find the next song
               console.log("get the new song");

               var currentIndex = allSongsPlaybackState.index;

               // add 1 to current index to get the next song
               var nextSongIndex = currentIndex + 1;

               // stop the current song
               playMe.howl.stop();

               setPausePlayButton('pause');

               // find cover
               let thisSongsAlbum = props.albums.Albums.find(album => album.album.AlbumName == allSongsPlaybackState.allSongs[nextSongIndex].albumName)

               setPlayMe({
                    playingAllSongs: true,
                    howl: new Howl({
                         src: allSongsPlaybackState.allSongs[nextSongIndex].Path
                    }),
                    Path: allSongsPlaybackState.allSongs[nextSongIndex].Path,
                    Title: allSongsPlaybackState.allSongs[nextSongIndex].Title,
                    AlbumArtist: allSongsPlaybackState.allSongs[nextSongIndex].artist,
                    AlbumName: allSongsPlaybackState.allSongs[nextSongIndex].albumName,
                    Cover: thisSongsAlbum.album.CoverInBase64
               })
          
          // one album is being played
          } else {
               // current song that is playing
               var currentIndex = queueState.Tracklist.findIndex((obj => obj.Path == playMe.howl._src));

               // add 1 to current index to get the next song
               var nextSongIndex = currentIndex + 1;

               // stop the current song
               playMe.howl.stop();

               setPausePlayButton('pause');

               setPlayMe({
                    playingAllSongs: false,
                    howl: new Howl({
                         src: queueState.Tracklist[nextSongIndex].Path
                    }),
                    Path: queueState.Tracklist[nextSongIndex].Path,
                    Title: queueState.Tracklist[nextSongIndex].Title,
                    AlbumArtist: queueState.AlbumArtist,
                    AlbumName: queueState.AlbumName,
                    Cover: queueState.Cover
               })
          }
     });














     // Pause / Play / Next / Previous Buttons Functionality ----------------------------------------------------------------------------------------------------------

     // set pause/play button state with initial state of pause
     const [pausePlayButton, setPausePlayButton] = useState('pause');

     // function to pause or play music
     function pauseOrPlayMusic() {

          // if song is playing, from Howler.js
          if (playMe.howl?.playing()) {
               // pause the music
               playMe.howl.pause();          
               // show the play button
               setPausePlayButton('play');

          } else {
               // play the music
               playMe.howl?.play();
               // show the pause button
               setPausePlayButton('pause');
          }
     }

     // return the proper icon for the play / pause button
     function showPausePlayButton(pausePlayButton) {
          if (pausePlayButton == "pause") {
               return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="iconInButton" fill="currentColor" viewBox="0 0 320 512">
                         <path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"/>
                    </svg>
               );
          } else {
               return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="iconInButton" fill="currentColor" viewBox="0 0 384 512">
                         <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/>
                    </svg>
               );
          }
     }

     // functionality for playing the previous song
     function previousSong() {

          // set the state for play / pause button icon
          setPausePlayButton('pause');

          // get the current playback percentage for use in the if function below
          var percentage = ((playMe.howl?.seek()/playMe.howl?.duration())*100).toFixed(0);

          // if all songs are being played
          if (playMe.playingAllSongs) {
               // get the current queue state index
               var currentIndex = allSongsPlaybackState.allSongs.findIndex((obj => obj.Path == playMe.howl._src))

               // subtract 1 to current index to get the next song
               var previousSongIndex = currentIndex - 1;
               
          // if only an album is being played
          } else {
               // get the current queue state index
               var currentIndex = queueState.Tracklist.findIndex((obj => obj.Path == playMe.howl._src));

               // subtract 1 to current index to get the next song
               var previousSongIndex = currentIndex - 1;
          }
         

          // note: this is general ux from other music playing apps. I like it so i am replicating it

          // if the nextSongIndex is negative, there is no song to go back to so restart the current song
          if (previousSongIndex < 0) {
               // stop the current song
               playMe.howl.stop();
               // note: in howlerjs, stopping the current song clears playback progess

               // play the current song
               playMe.howl.play();
               
          } else if (percentage > 12) {
               // else, if the current playback progress is less than 12% of the song's length, restart this song
               // stop the current song
               playMe.howl.stop();
               // note: in howlerjs, stopping the current song clears playback progess

               // play the current song
               playMe.howl.play();
          
          } else {
               // stop the current song
               playMe.howl.stop();

               // if all songs are being played
               if (playMe.playingAllSongs) {
                    
                    // get the cover
                    let thisSongsAlbum = props.albums.Albums.find(album => album.album.AlbumName == allSongsPlaybackState.allSongs[previousSongIndex].albumName)
                    
                    // then go back one song
                    setPlayMe({
                         playingAllSongs: true,
                         howl: new Howl({
                              src: allSongsPlaybackState.allSongs[previousSongIndex].Path
                         }),
                         Path: allSongsPlaybackState.allSongs[previousSongIndex].Path,
                         Title: allSongsPlaybackState.allSongs[previousSongIndex].Title,
                         AlbumArtist: allSongsPlaybackState.allSongs[previousSongIndex].artist,
                         AlbumName: allSongsPlaybackState.allSongs[previousSongIndex].albumName,
                         Cover: thisSongsAlbum.album.CoverInBase64
                    })
                    
               // if only an album is being played
               } else {
                    // then go back one song
                    setPlayMe({
                         playingAllSongs: false,
                         howl: new Howl({
                              src: queueState.Tracklist[previousSongIndex].Path
                         }),
                         Path: queueState.Tracklist[previousSongIndex].Path,
                         Title: queueState.Tracklist[previousSongIndex].Title,
                         AlbumArtist: queueState.AlbumArtist,
                         AlbumName: queueState.AlbumName,
                         Cover: queueState.Cover
                    })
                    
               }
          }
     }

     // functionality for the next song button
     function nextSong() {

          // if all songs are being played
          if (playMe.playingAllSongs) {
               
               // set the state for play / pause button icon
               setPausePlayButton('pause');

               // current song that is playing
               var currentIndex = allSongsPlaybackState.allSongs.findIndex((obj => obj.Path == playMe.howl._src))

               // add 1 to current index to get the next song
               var nextSongIndex = currentIndex + 1;

               // stop the current song
               playMe.howl.stop();


               // get the cover
               let thisSongsAlbum = props.albums.Albums.find(album => album.album.AlbumName == allSongsPlaybackState.allSongs[nextSongIndex].albumName)

               setPlayMe({
                    playingAllSongs: true,
                    howl: new Howl({
                         src: allSongsPlaybackState.allSongs[nextSongIndex].Path
                    }),
                    Path: allSongsPlaybackState.allSongs[nextSongIndex].Path,
                    Title: allSongsPlaybackState.allSongs[nextSongIndex].Title,
                    AlbumArtist: allSongsPlaybackState.allSongs[nextSongIndex].artist,
                    AlbumName: allSongsPlaybackState.allSongs[nextSongIndex].albumName,
                    Cover: thisSongsAlbum.album.CoverInBase64
               })

          // if only an album is being played
          } else {
               // current song that is playing
               var currentIndex = queueState.Tracklist.findIndex((obj => obj.Path == playMe.howl._src));

               // add 1 to current index to get the next song
               var nextSongIndex = currentIndex + 1;

               // stop the current song
               playMe.howl.stop();

               // set the state for play / pause button icon
               setPausePlayButton('pause');

               setPlayMe({
                    playingAllSongs: false,
                    howl: new Howl({
                         src: queueState.Tracklist[nextSongIndex].Path
                    }),
                    Path: queueState.Tracklist[nextSongIndex].Path,
                    Title: queueState.Tracklist[nextSongIndex].Title,
                    AlbumArtist: queueState.AlbumArtist,
                    AlbumName: queueState.AlbumName,
                    Cover: queueState.Cover
               })
          }
     }

     


     return(
          <div 
          className="playerControls">

               <div
               className="playerControlsSongInfo">

                    <img
                    className="playMeCover"
                    src={playMe.Cover}/>

                    <div
                    className="playMeText">

                         <span 
                         className="playMeInfo">
                              {playMe.Title}
                         </span>
                         
                         <span
                         className="playMeInfo">
                              {playMe.AlbumName}
                         </span>

                         <span
                         className="playMeInfo">
                              {playMe.AlbumArtist}
                         </span>

                    </div>

               </div>

               <div
               className="playerControlsButtons">

                    <div 
                    className="progressBarHolder">
                         <ProgressBar playMe={playMe}/>
                    </div>

                    <button
                    onClick={previousSong}
                    className="btn btn-custom shadow-none btn-playerControls">
                         <svg xmlns="http://www.w3.org/2000/svg" className="iconInButton" fill="currentColor" viewBox="0 0 448 512">
                              <path d="M77.25 256l137.4-137.4c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-160 160c-12.5 12.5-12.5 32.75 0 45.25l160 160C175.6 444.9 183.8 448 192 448s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L77.25 256zM269.3 256l137.4-137.4c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-160 160c-12.5 12.5-12.5 32.75 0 45.25l160 160C367.6 444.9 375.8 448 384 448s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L269.3 256z"/>
                         </svg>
                    </button>

                    <button
                    className="btn btn-custom shadow-none btn-playerControls"
                    onClick={pauseOrPlayMusic}>
                         {showPausePlayButton(pausePlayButton)}
                    </button>

                    <button
                    onClick={nextSong}
                    className="btn btn-custom shadow-none btn-playerControls">
                         <svg xmlns="http://www.w3.org/2000/svg" className="iconInButton" fill="currentColor" viewBox="0 0 448 512">
                              <path d="M246.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L178.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C47.63 444.9 55.81 448 64 448s16.38-3.125 22.62-9.375l160-160C259.1 266.1 259.1 245.9 246.6 233.4zM438.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L370.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C239.6 444.9 247.8 448 256 448s16.38-3.125 22.62-9.375l160-160C451.1 266.1 451.1 245.9 438.6 233.4z"/>
                         </svg>
                    </button>
               </div>

          </div>
     );
}