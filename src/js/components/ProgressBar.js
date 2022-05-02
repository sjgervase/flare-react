import React, { useEffect, useState } from "react";

export default function PlayerControls(props) {

     // Progress Bar Functionality ----------------------------------------------------------------------------------------------------------

     // progress bar state 
     const [progressBarState, setProgressBarState] = useState(0);

     // TODO: seperate component so the timing stops messing with everything else?
     // check 10 times per second to update progress bar
     useEffect(() => {

          if (props.playMe != "initialState") {
               const interval = setInterval(() => {
                    var percentage = ((props.playMe.howl?.seek()/props.playMe.howl?.duration())*100).toFixed(1) + "%"
                    setProgressBarState(
                         percentage
                    );
               }, 100);
               return () => clearInterval(interval);
          }
     }, [props.playMe]);

     
     return(
          <div
               className="progressBarMover"
               style={{ width: progressBarState}}>

          </div>
     );
}
