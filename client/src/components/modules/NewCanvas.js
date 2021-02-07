import React from 'react'
import { socket, drew } from "../../client-socket.js";
import { usePersistentCanvas, clear, draw } from './Hooks.js'
import { useState, useEffect, useRef } from "react";
import { post } from "../../utilities";
/**
 * The NewCanvas is the main game board, where pixelers can fill pixels
 * @param isMyTurn
 * @param game_id
 * @param {String} color color of pixel in hex
 * 
 */
function NewCanvas(props) {
  const [location, setLocation, canvasRef, rect] = usePersistentCanvas()

  function handleCanvasClick(e, color) {
    if (props.isMyTurn && !props.isGuesser) { //only set state if it's ur turn and ure not guesser 
      let location = { x: Math.floor(e.clientX - rect.left), y: Math.floor(e.clientY - rect.top), color: color, game_id: props.game_id, isMyTurn: props.isMyTurn, isGuesser: props.isGuesser}
      console.log("I AM SETTING LOCATION")
      drew(location);
      setLocation(location)
    }
  }
  
socket.on("iDrew", (data) => {
  console.log("OIAJOSJDA" + data.x)
      console.log("SOCKET WORKSSS")
        if (data.game_id === props.game_id){
          console.log("data" + data)
            listenCanvasClick(data)
        }
        
    });

  useEffect(() => {
    //listens for if someone clicked on canvas/changed a pixel on YOUR CANVAS
    

    /* return () => socket.disconnect(); */ //for reasons in https://www.valentinog.com/blog/socket-react/
  }, [location]); //hook only runs once

  function listenCanvasClick(location1) {
    let listenerLocation = { x: location1.x, y: location1.y, color: location1.color, game_id: props.game_id, isMyTurn: props.isMyTurn, isGuesser: props.isGuesser};

    if (!isEqual(location1)){
      setLocation(listenerLocation);
    }
    
    
  }

  function isEqual(location1) {
    console.log("IT AINT EQUAL ?" + location1 + location)
    if (location1.x == location.x && location1.y == location.y && location1.color == location.color){
      console.log("true");
      return true
    }
    return false
  }
  //lets not worry about this for now uh o.o
/*   function handleClear() {
    setLocation(null)
  }

  function handleUndo() {
    setLocations({x: location.x, y: location.y, color: "#FFFFFF"})
  } */

  return (
    <>
     {/*  <div className="controls">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div> */}
      <canvas
        ref={canvasRef}
        width="500"
        height="500"
        onClick={(e) => {console.log("I CLIEKED"); handleCanvasClick(e, props.color); }}
      />
    </>
  )
}

export default NewCanvas
