import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { get, post, put} from "../../utilities";

/* const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Chilanka',
      'cursive',
    ].join(','),
  },});
 */
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '10ch',
      /* color: rgb(100, 100, 100), */
    },
    '& .MuiInputBase-root': {
      fontFamily: 'Alata',
      color: 'rgb(100, 100, 100)',
    },
    '& .MuiMenuItem-root': {
      fontFamily: 'Alata',
      color: 'rgb(100, 100, 100)',
    },
    '& .MuiListItem-root': {
      fontFamily: 'Alata',
      color: 'rgb(100, 100, 100)',
    },
  },
}));

/**
 * MenuItem shows list of wordpacks
 * 
 * @param game_id created in NewGame by the host (what the host inputted)
 * @param wordPacks
 */

export default function MultilineTextField(props) {

  const classes = useStyles();
  const [wordPack, setWordPack] = React.useState('basic');/* 
  const [pixelLimit, setPixelLimit] = React.useState(1);
  const [wantPixelLimit, setWantPixelLimit] = React.useState(false) */
  const [sessionValues, setSessions] = React.useState(1);

  const handleWordpackChange = (event) => {
    setWordPack(event.target.value);
    post("/api/game/changedWordPack", {
      wordPack: event.target.value,
      game_id: props.game_id
    }).then(()=> console.log("I changed my word pack"))
  };

 //changes the number of sessions
  const handleSessionValueChange = (event) => {
    setSessions(event.target.value);
    post("/api/game/changedSessions", {
      sessions: event.target.value,
      game_id: props.game_id
    }).then(()=> console.log("I changed my sessions"))
  }

 /*   //changes the number of pixels/person
   const handlePixelLimitChange = (event) => {
    setPixelLimit(event.target.value);
    post("/api/game/changedPixelLimit", {
      pixelLimit: event.target.value,
      game_id: props.game_id
    }).then(()=> console.log("I changed my pixel limit"))
  }

  //changes switch if you want limit change
  const handleWantPixelLimitChange = (event) => {
    setWantPixelLimit(event.target.checked);
    post("/api/game/changedWantPixelLimit", {
      wantPixelLimit: event.target.checked,
      game_id: props.game_id
    }).then(()=> console.log("I want/dont want to change my pixel limit"))
  } */

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="outlined-select-wordPack"
          select
          value={wordPack}
          onChange={handleWordpackChange}
          helperText="word pack"
          variant="outlined"
        >
          {props.wordPacks.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        </div>
        <div>
        <TextField
          id="outlined-number"
          select
          type="number"
          value={sessionValues}
          // InputProps={{ inputProps: { min: 1, max: 10 } }}
          variant="outlined"
          helperText="# of rounds"
          onChange={handleSessionValueChange}
          InputLabelProps={{
            shrink: true,
          }}
        >{props.sessionValues.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}</TextField>
      </div>
    </form>
  );
}
