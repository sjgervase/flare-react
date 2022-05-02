
import * as api from "../api/musicLibraryAPI";
//  ^^^ import all functions from /api/musicLibraryAPI and call it api


// function to get data from api/musicLibraryAPI.js
export function fetchMusic() {
     
     return async function(dispatch) {
          // returns album object
          const albums = await api.fetchMusic();
          
          dispatch({
               type: "LIBRARY_FETCH_SUCCESS",
               albums
          })

          return albums;
     }
}