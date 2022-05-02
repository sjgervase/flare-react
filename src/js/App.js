import React, { useState, useEffect } from 'react';


import { Provider } from "react-redux";


// // import components
import Navbar from "./components/Navbar";

// data store. dont need to specify file bc file is named index.js
import configureStore from "./store";


import { HashRouter as Router } from "react-router-dom";


const store = configureStore();


import Container from './Container';

export default function App() {     

     return (

          <Provider store={store}>
               <Router>
                    <Navbar />
                    <div className="content-wrapper">
                         <Container/>
                    </div>
               </Router>
          </Provider>
     
     );

}
