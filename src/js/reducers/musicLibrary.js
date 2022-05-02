const DEFAULT_STATE = {
     Albums: []
}

export default function musicLibraryReducer(state = DEFAULT_STATE, action) {
     switch(action.type) {

          case "LIBRARY_FETCH_SUCCESS":
               return { items: action.albums };

          default: {
               return state;
          }

     }
}