import { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;
const NUM_PIXELS = 20;

export function draw(ctx, location) {
    
  console.log("MY LOCATOIN " + location.x + "y is " + location.y)
  console.log("REEEEEEEEEEEEE " + location.isMyTurn + "AM I GUESSER " + location.isGuesser)
  if (location.isMyTurn && !location.isGuesser){ //only the person whose turn it is can change pixels and emit
    console.log("REEEEEEEEE2");
    post("/api/game/color", {
      location: location, 
      game_id: location.game_id
  }).then(()=> {
      console.log("it's my turn and i'm changing the color")
    }).catch((err)=> {
      console.log("ERRORRR " + err)
    })
  }

  ctx.fillStyle = location.color;
  ctx.save();
  ctx.fillRect(
    Math.floor(CANVAS_WIDTH / NUM_PIXELS) *
      Math.floor(location.x / Math.floor(CANVAS_WIDTH / NUM_PIXELS)),
    Math.floor(CANVAS_HEIGHT / NUM_PIXELS) *
      Math.floor(location.y / Math.floor(CANVAS_HEIGHT / NUM_PIXELS)),
    Math.floor(CANVAS_WIDTH / NUM_PIXELS),
    Math.floor(CANVAS_HEIGHT / NUM_PIXELS)
  );
  ctx.restore();
}

export function clear(ctx) {
    console.log("I AME CLEARING THE BOARD")
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function usePersistentState(init) {

  //sets location
  const [location, setLocation] = useState(
    JSON.parse(sessionStorage.getItem("location")) || init
  );

  useEffect(() => {
    sessionStorage.setItem("location", JSON.stringify(location));
  });

  return [location, setLocation];
}

export function usePersistentCanvas() {
  const [location, setLocation] = usePersistentState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    //if there is a location sent, draw it. otehrwise, it means to clear the canvas
    if (location) {
        let mousePos;
        if (location.isMyTurn && !location.isGuesser) { //if it's my turn, then return the relative location since the location i get is a pure location
            mousePos = { x: Math.floor(location.x - rect.left), y: Math.floor(location.y - rect.top), color: location.color, game_id: location.game_id, isMyTurn: location.isMyTurn, isGuesser: location.isGuesser }
        } else { //if i'm just a listener, i got a relative position from socket,
            mousePos = location;
        }
        
        draw(ctx, mousePos)
    } else {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  });

  return [location, setLocation, canvasRef];
}