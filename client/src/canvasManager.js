let canvas;
/** utils */
let drag=false;
// lol please centralize this
const BOARD_WIDTH_BLOCKS = 20;
const BOARD_HEIGHT_BLOCKS = 20;
const PIXEL_SIZE = 500/BOARD_HEIGHT_BLOCKS;

//gets mouse position
const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}
// rounds down a coordinate in a normal X Y plane to nearest block location
const convertCoord = (x, y) => {
  if (!canvas) return;
  return {
    drawX: Math.floor(x/BOARD_WIDTH_BLOCKS),
    drawY: Math.floor(y/BOARD_HEIGHT_BLOCKS),
  };
};

// fills a Pixel at a given x, y canvas coord with size + color (HEX)
const fillPixel = (context, x, y, size, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
};

/** drawing functions */

const drawPixel = (context, x, y, color) => {
  const { drawX, drawY } = convertCoord(x, y);
  fillPixel(context, drawX, drawY, PIXEL_SIZE, color);
};

const clearCanvas = () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

};

const drawHover = (context, x, y, color) => {
  const { drawX, drawY } = convertCoord(x, y);
  fillPixel(context, drawX, drawY, PIXEL_SIZE, color.concat("7F"));
}

//drawState: isMyTurn
const drawCanvas = (drawState) => {
  // get the canvas element
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");

  if (drawState.isMyTurn){ //only add in these events/alter canvas if it's your turn
    //if move, then add in hover color
    canvas.addEventListener('mousemove', (evt)=> {
      drawHover(context, getMousePos(canvas, evt).x, getMousePos(canvas, evt).y, drawState.color)
    });

    //if clicked, draw pixel
    canvas.addEventListener('mousedown', (evt)=> {
      drag=true;
      drawPixel(context, getMousePos(canvas, evt).x, getMousePos(canvas, evt).y, drawState.color);
    });

    canvas.addEventListener('mouseup', (evt) => {
      drag=false;
    })
  }
  
  // draw all the players
  Object.values(drawState.players).forEach((p) => {
    drawPixel(context, p.x, p.y, p.color);
  });
};


/** main draw */
export {drawCanvas, clearCanvas};
