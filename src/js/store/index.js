import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import musicLibraryReducer from "../reducers/musicLibrary";


export default function configureStore() {

     // causes dispatch into action
     const middlewares = [
          thunkMiddleware
     ];
     
     const store = createStore(
          combineReducers({
               albums: musicLibraryReducer
          }),
          // from redux docs
          applyMiddleware(...middlewares)
     );

     return store;
}