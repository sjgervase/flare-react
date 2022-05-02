// Main Process

// DONT FORGET TO RUN NPM WATCH
const { app, BrowserWindow, ipcMain, Notification, getCurrentWindow } = require('electron');
const path = require('path');
const isDevelopmentMode = !app.isPackaged;
const fs = require('fs');
const {dialog, remote} = require('electron');
// music metadata module
const mm = require('music-metadata');

// sharp image processing
const sharp = require("sharp");


// Create Window function
function createWindow() {
     // Browser Window <- Renderer Process
     const win = new BrowserWindow({
          width : 1600,
          height: 800,
          minWidth: 1000,
          minHeight: 430,
          width: 1600,
          height: 800,
          frame: false,
          webPreferences: {
               nodeIntegration: true,
               worldSafeExecuteJavaScript: true,
               contextIsolation: false
          }
     })

     win.loadFile('index.html')
     isDevelopmentMode && win.webContents.openDevTools();

     // custom close
     ipcMain.on('closeApp', () => {
          app.quit();
     })

     // custom minimize
     ipcMain.on('minimizeApp', () => {
          win.minimize();
     })

     // custom maximize
     ipcMain.on('maximizeRestoreApp', () => {
          if (win.isMaximized()) {
               win.restore();
          } else {
               win.maximize();
          }
     })

     
}


// Additional functionality if the file is in devmode
if (isDevelopmentMode) {
     require('electron-reload')(__dirname, {
          electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
     })
}


// create window when ready
app.whenReady().then(createWindow);


// if NOT on mac, quit app when all windows are closed
app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
          app.quit();
     }
})


// on activate, create window if there are no others
app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
     }
})


// notificationAPI
ipcMain.on('notify', (_, message) => {
     new Notification({title: 'Notification', body: message}).show();
})


// ensure library files exist in the userData folder and if not, create them
function libraryDataVerifier() {
     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var musicLibraryFile = path.join(userDataPath, "MusicLibrary.json");

     // if the library file already exists, do nothing
     if (fs.existsSync(musicLibraryFile)) {
     // path exists
     } else {
          console.log("library file DOES NOT exist:");
          var libdata = '{"Albums":[]}';

          // create the file and add the empty data
          fs.writeFileSync(musicLibraryFile, libdata,
               {
                    encoding: "utf8",
                    // a means append
                    flag: "a"
               },
               (err) => {
                    if (err)
                    console.log(err);

                    else {
                         console.log("library file written successfully");
                    }
               }
          );
     }
}

// when app is ready, run above function to ensure library files exist in the userData folder and if not, create them
app.whenReady().then(libraryDataVerifier());




// get albums currently in library
function libraryDataGrabber() {
     // create object to hold music data
     let musicLibraryData = {};

     // create object to hold cover data
     // let coverArtCollection = {};

     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var musicLibraryFile = path.join(userDataPath, "MusicLibrary.json");

     // build the string to the path of the current user library json file
     // var albumCoverDataFile = path.join(userDataPath, "MusicAlbumCoverData.json");

     // function to parse the data
     async function documentReader(){
          // console.log("documentRead");
          musicLibraryData = JSON.parse(fs.readFileSync(musicLibraryFile, 'utf8'));
          // coverArtCollection = JSON.parse(fs.readFileSync(albumCoverDataFile, 'utf8'));

          // return album object
          return musicLibraryData;
     }
     // run above documentReader function
     documentReader();

     return musicLibraryData;
}

// runs above function to get albums in library
ipcMain.handle('musicLibraryRequest', async (event, arg) => {
     // get the objects from the file
     const musicLibraryDataReturn = await libraryDataGrabber();
     return musicLibraryDataReturn;
 })




// get metadata from songs added via filepicker and write them to the library
function getMetaDataFromFiles(songFilePathsNEW) {
     // the below is a framework from music-metadata's npmjs.com page. some object names were changed to make it easier for me to read

     // get the first element of the array and also remove it as we iterate through this array
     const audioFile = songFilePathsNEW.shift();
     
     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // if the file exists...
     if (audioFile) {
          try {
               return mm.parseFile(audioFile).then(metadata => {
                    // Do great things with the metadata

                    // check if already there so the track can be appended rather than adding an additional instance of the album
                    // get all albums in MusicLibrary.JSON,
                    // see if any album name in the array is something that is about to be added
                    // if the album already exists, call new function in MusicLibrary.js to append the album
                    // else, add the album with original function

                    // get the album of the current item
                    var currentItemAlbumName = metadata.common.album;

                    // get the albums list from the json file
                    // returns an array of all albums
                    var albumsList = musicLibraryData.Albums;

                    // create empty array to store album names
                    var albumNamesInLibrary = [];

                    // create an empty array to store GUIDs, to ensure that no album will have duplicate GUIDs
                    var albumGUIDsInLibrary = [];

                    // get all album names in albumList
                    for (var i = 0; i < albumsList.length; i++) {
                         albumNamesInLibrary.push(albumsList[i].album.AlbumName);
                         albumGUIDsInLibrary.push(albumsList[i].album.GUID);
                    }

                    // returns true if the album is in the library but not the song
                    //console.log(albumNamesInLibrary.includes(currentItemAlbumName));

                    // if the album is already in the library,
                    if (albumNamesInLibrary.includes(currentItemAlbumName)) {
                         // run function append album in library
                         console.log("album already exists");

                         var songToAdd = {
                              "Path": audioFile,
                              "Title": metadata.common.title != undefined ? metadata.common.title : audioFile.split("\\").pop(),
                              "TrackNumber": metadata.common.track,
                              "DiscNumber" : metadata.common.disk,
                              "FileType": metadata.format.container,
                              "IsLossless": metadata.format.lossless,
                              "BitsPerSample": metadata.format.bitsPerSample,
                              "SampleRate": metadata.format.sampleRate,
                              "Duration": metadata.format.duration,
                              "LikedSong": false
                         };

                         // find the album that already exists
                         let albumtoappend = albumsList.find(o => o.album.AlbumName === currentItemAlbumName);

                         // add this song to the tracklist
                         albumtoappend.album.Tracklist.push(songToAdd);

                    // if the album name is NOT in the library
                    } else {

                         // generate 20 digit GUID for album and album art
                         let randomGUID = (length = 20) => {
                              let str = "";

                              // create a GUID within a while loop. this will loop infinitely until a GUID is not already being used.
                              // dev note: there are 7.04423425547 x 10^35 unique GUIDs (62 total characters to the power of 20, the length).
                              while (true) {
                                   // Declare all characters
                                   let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                                   // Pick characers randomly and add them to "str" variable to create random string
                                   for (let i = 0; i < length; i++) {
                                        str += chars.charAt(Math.floor(Math.random() * chars.length));
                                   }

                                   // if str is not being used as a GUID already, break the while loop
                                   if (!(albumGUIDsInLibrary.includes(str))) {
                                        break;
                                   }
                              }

                              return str;
                         };

                         var albumGUID = randomGUID();

                         // do pictureData first
                         //ensure picture data exists
                         if (metadata.common.picture) {
                              var songPictureObject = metadata.common.picture[0];



                              // // get the data from the picture object
                              var songPictureParsed = JSON.parse(JSON.stringify(songPictureObject));

                              // // get the picture format
                              var songPictureFormat = songPictureParsed.format;
                              

                              // // utilize a buffer to return the picture data. this can be encoded to base64 and used by HTML img tags
                              let buff = new Buffer.from(songPictureParsed.data.data, "base64");
                              var songPictureData = buff.toString('base64');

                         } else {
                              var songPictureFormat = "image/jpeg";
                              var songPictureData = fs.readFileSync('./src/js/components/imgs/image-not-available.png', 'base64');
                         };

                         // create album object
                         let albumToAdd = {
                              "album":{
                                   "GUID": albumGUID,
                                   "AlbumName": metadata.common.album,
                                   "AlbumArtist": metadata.common.artist,
                                   "YearReleased": metadata.common.year,
                                   "Genre": metadata.common.genre,
                                   "Tracklist": [
                                        {
                                             "Path": audioFile,
                                             "Title": metadata.common.title != undefined ? metadata.common.title : audioFile.subString(audioFile.lastIndexOf('/') + 1),
                                             "TrackNumber": metadata.common.track,
                                             "DiscNumber" : metadata.common.disk,
                                             "FileType": metadata.format.container,
                                             "IsLossless": metadata.format.lossless,
                                             "BitsPerSample": metadata.format.bitsPerSample,
                                             "SampleRate": metadata.format.sampleRate,
                                             "Duration": metadata.format.duration,
                                             "LikedSong": false
                                        }
                                   ],
                                   // the proper syntax for an img src in base64
                                   "CoverInBase64": 'data:' + songPictureFormat + ';base64,' + songPictureData
                              }
                         };

                         // push the album to the musicLibraryData object
                         musicLibraryData.Albums.push(albumToAdd);

                    }
                    return getMetaDataFromFiles(songFilePathsNEW); // process rest of the files AFTER we are finished
               });
          } catch (e) {

          }

     }
     return Promise.resolve("success").then(function(value){
          console.log(value);
          // this runs a single time after completion of the above function

          // build the string to the path of the current user library json file
          var musicLibraryFile = path.join(userDataPath, "MusicLibrary.json");

          // update the library file
          fs.writeFileSync(path.resolve(musicLibraryFile), JSON.stringify(musicLibraryData));
     });
}


// File picker function
ipcMain.on('openFilePicker', (event, args) => {
     console.log("clicked on file picker");
     dialog.showOpenDialog({
          title: 'Select a folder',
          buttonLabel: 'Add to Flare',
          defaultPath: 'C:/',
          properties: ['openDirectory', 'multiSelections']
     }).then(function (response) {

          // if file picker isnt canceled
          if (!response.canceled) {

               // path to OS appdata folder
               const userDataPath = app.getPath('userData');

               // create empty array of files that will be added
               let songFilePathsNEW = [];

               // read the current paths to ensure duplicates are not available

               // build the string to the path of the current user library json file
               var musicLibraryFile = path.join(userDataPath, "MusicLibrary.json");

               // build the string to the path of the current user cover art json file
               // var albumCoverDataFile = path.join(userDataPath, "MusicAlbumCoverData.json");

               // get music library data
               musicLibraryData = JSON.parse(fs.readFileSync(musicLibraryFile, 'utf8'));

               // get cover art data
               // coverArtCollection = JSON.parse(fs.readFileSync(albumCoverDataFile, 'utf8'));

               // get the albums list from the json file
               // returns an array of all albums
               var albumsList = musicLibraryData.Albums;
               // console.log(albumsList);

               // create an emtpy array that will be populated with each song path of each album to ensure there are no duplicated being added
               var songsInLibraryArray = [];

               // iterate through each album to get all paths in the tracklist array of each album
               for (var x = 0; x < albumsList.length; x++) {
                    var tracklistArray = albumsList[x].album.Tracklist;

                    // iterate through each item in tracklist Array
                    for (var y = 0; y < tracklistArray.length; y++) {
                         // send files in library to array
                         songsInLibraryArray.push(tracklistArray[y].Path)
                    }
               }

               // ensuring selected files are vaild (music files) and sending them to the parse "getMetaDataFromFiles" function above
               function fromDir(startPath,filter){

                    if (!fs.existsSync(startPath)){
                         console.log("no dir ",startPath);
                         return;
                    }

                    var files=fs.readdirSync(startPath);

                    // for each file selected,
                    for(var i = 0; i < files.length; i++){
                         // create the full filepath
                         var filename = path.join(startPath, files[i]);
                         // lstatsync gets information about the file
                         var stat = fs.lstatSync(filename);

                         if (stat.isDirectory()){
                              fromDir(filename, filter); //recurse

                         // if the file extension is allowed (see below)
                         } else if (filename.indexOf(filter) >= 0) {

                              // if the file is already in the music library
                              if (songsInLibraryArray.includes(filename)) {
                                   console.log("song already in flare library");
                              } else {
                                   // add the filename to the array of files to add
                                   songFilePathsNEW.push(filename);
                              }
                         }
                    }
               }

               // filter file extensions to music only, based on howler.js support
               for (var i = 0; i < response.filePaths.length; i++) {
                    // these are added manually until i can check for support
                    fromDir(response.filePaths[i],'.flac');
                    fromDir(response.filePaths[i],'.mp3');
                    fromDir(response.filePaths[i],'.opus');
                    fromDir(response.filePaths[i],'.ogg');
                    fromDir(response.filePaths[i],'.wav');
                    fromDir(response.filePaths[i],'.aac');
                    fromDir(response.filePaths[i],'.m4a');
                    fromDir(response.filePaths[i],'.m4b');
                    fromDir(response.filePaths[i],'.webm');
               }

               // only run the parser function if there are songs in the array
               if (songFilePathsNEW.length > 0) {
                    // send files and album list to parser
                    return getMetaDataFromFiles(songFilePathsNEW);
               }

          } else {
               console.log("no file selected");
          }
     });
})


// Change metadata
ipcMain.handle("changeMetaData", async (event, args) => {
     // console.log(args);

     // if the first argument is "like", the end user just wants to update the liked status
     if (args[0] == "like") {
          // recieves ["like", path of song, album name, and current liked value] in that order

          // console.log(args[2]);

          // get all albums from file,
          // search albums for recieved name, 
          // search album tracklist for recieved path,
          // update value based to the opposite of what was received (as it is a switch)
          // write updated data

          // path to OS appdata folder
          var userDataPath = app.getPath('userData');

          // build the string to the path of the current user library json file
          var musicLibraryFile = path.join(userDataPath, "MusicLibrary.json");


          // get all music library data
          let musicLibraryData = JSON.parse(fs.readFileSync(musicLibraryFile, 'utf8'));

          var albumsList = musicLibraryData.Albums;


          // args 2 is the array value of the album name
          let albumToChange = albumsList.find(album => album.album.AlbumName == args[2]);

          // args 1 is the array value of the path
          let songToChange = albumToChange.album.Tracklist.find(song => song.Path == args[1]);

          if (args[3]) {
               songToChange.LikedSong = false;
          } else {
               songToChange.LikedSong = true;
          }
          
          // update the library file
          fs.writeFileSync(path.resolve(musicLibraryFile), JSON.stringify(musicLibraryData));
     }
})


// Chromium -> web eingine for rendering the UI, full Chrome-like web browser
// V8 -> engine that provides capabilities to execute, run, JS code in the browser
// Node JS(V8) -> we are able to run JS code + provides more features

// Webpack -> is a module builder, main purpose is to bundle JS files for usage in the browsert
// Babel -> js a JS compiler
