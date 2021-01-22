import React from 'react'
import { socket } from "../../client-socket.js";
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
  const [location, setLocation, canvasRef] = usePersistentCanvas()

  function handleCanvasClick(e, color) {
    if (props.isMyTurn && !props.isGuesser) { //only set state if it's ur turn and ure not guesser 
      let location = { x: Math.floor(e.clientX), y: Math.floor(e.clientY), color: color, game_id: props.game_id, isMyTurn: props.isMyTurn, isGuesser: props.isGuesser}
      //haven't actually tested this out yet ... but if no change in location, don't do anything
      //this is to avoid unnecessary rerendering/posts
      /* if (location1 != location){ */
        console.log("I AM SETTING LOCATION")
        setLocation(location)
      /* } */
    }
    
  }
  socket.on("clicked", (clicked) => {
    console.log("SOCKET WORKSSS")
      if (clicked.game_id === props.game_id){
          listenCanvasClick(clicked.location)
      }
      
  });
  useEffect(() => {
    //listens for if someone clicked on canvas/changed a pixel on YOUR CANVAS
    

    /* return () => socket.disconnect(); */ //for reasons in https://www.valentinog.com/blog/socket-react/
  }, []); //hook only runs once

  function listenCanvasClick(location1) {
    /* console.log("I AM BEING LISTENED OH NO BUT YAEY THE SOCKET WORK HEHE"); */
    let listenerLocation = { x: location1.x, y: location1.y, color: location1.color, game_id: props.game_id, isMyTurn: props.isMyTurn, isGuesser: props.isGuesser};

    setLocation(listenerLocation);
    
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
        onClick={(e) => {handleCanvasClick(e, props.color);
            /* if (props.isMyTurn) { //only allows the person whose turn it is to add pixels
                
            } */
        }}
      />
    </>
  )
}

export default NewCanvas
