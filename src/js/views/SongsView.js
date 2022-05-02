import React from "react";

import SongItem from "../components/SongItem";


export default function SongsView(props) {

     // console.log(props);

     // for each item in props.albums.Albums.album.Tracklist

     const allSongs = [];

     // console.log(props);

     


     if (props.albums) {

          // console.log(props.albums);

          // for each album
          for (let i = 0; i < props.albums.Albums.length; i++) {

               // for each song in each album
               for (let j = 0; j < props.albums.Albums[i].album.Tracklist.length; j++) {
                    
                    var song = props.albums.Albums[i].album.Tracklist[j];
                    // add the artist to the song data
                    song.artist = props.albums.Albums[i].album.AlbumArtist

                    // add the album name to the song data
                    song.albumName = props.albums.Albums[i].album.AlbumName

                    // add the year released to the song data
                    song.year = props.albums.Albums[i].album.YearReleased

                    allSongs.push(song);

                    if (song.Title == undefined) {
                         console.log(song.Path);
                    }
               }
          }
     }

     // console.log(allSongs);

     // props.playTheSongs

     function songsViewPlayback(position) {
          // console.log("songsViewPlayback");

          let index = position - 1;

          let thisSongsAlbum = props.albums.Albums.find(album => album.album.AlbumName == allSongs[index].albumName);

          // console.log(thisSongsAlbum);

          props.playTheSongs(allSongs, index, thisSongsAlbum);



          // find allSongs[index-1].albumName in props.albums.Albums for covers and shit
          
          // subtract one for index rather than count
          // let position = index - 1;

          
     }



     return (
          <div className="songsView">
               <div className="titleAndCount">
                    <h1 className="viewTitle">Songs</h1>
                    <span className="viewCount">{allSongs.length} Songs</span>
               </div>
               

               {allSongs.sort(function(a, b) {                  
                    if(a.Title.toLowerCase() < b.Title.toLowerCase()) return -1;
                    if(a.Title.toLowerCase() > b.Title.toLowerCase()) return 1;
                    return 0;
               }).map((song, index) => 
               
                    <SongItem
                         key={song.Path}

                         path={song.Path}
                         title={song.Title}
                         number={index + 1}
                         duration={song.Duration}
                         liked={song.LikedSong}
                         filetype={song.FileType}
                         lossless={song.IsLossless}
                         bits={song.BitsPerSample}
                         sampleRate={song.SampleRate}

                         artist={song.artist}
                         album={song.albumName}
                         year={song.year}

                         currentlyPlaying={props.currentlyPlayingState.song}

                         songsViewPlayback={songsViewPlayback}

                         renderingIn="SongsView"
                    />
               )}

               

               


          </div>
     )
}
