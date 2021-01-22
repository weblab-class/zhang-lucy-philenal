import React from 'react'
import { socket } from "../../client-socket.js";
import { usePersistentCanvas, clear, draw } from './Hooks.js'
import { useState, useEffect, useRef } from "react";

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
    let location = { x: Math.floor(e.clientX), y: Math.floor(e.clientY), color: color, game_id: props.game_id, isMyTurn: true, isGuesser: props.isGuesser}
    //tells server that you clicked a pixel to all other players!
    
    setLocation(location)
  }

  useEffect(() => {
    //listens for if someone clicked on canvas/changed a pixel on YOUR CANVAS
    socket.on("clicked", (clicked) => {
        if (clicked.game_id === props.game_id){
            listenCanvasClick(clicked.location)
        }
        
    })
  });

  function listenCanvasClick(location) {
      let listenerLocation = location
      listenerLocation.isMyTurn = false
      setLocation(listenerLocation)
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
