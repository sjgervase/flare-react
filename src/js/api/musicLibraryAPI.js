import { ipcRenderer } from "electron";

export const fetchMusic = () => {

     const musicLibraryDataReturn = async function() {
          
          const libdata = await ipcRenderer.invoke('musicLibraryRequest')
               .then(
                    musicLibraryDataReturn => {
                         return musicLibraryDataReturn 
                    }
               );
          return libdata;
     }



     const getMusicLibraryData = musicLibraryDataReturn();

     return getMusicLibraryData;
}
