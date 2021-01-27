import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { get, post, put} from "../../utilities";

//code adapted from material-ui
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
      fontFamily: 'Alata',
      margin: theme.spacing(1),
      width: '10ch',
      /* color: var(--border-color), */
    },
    '& .MuiInputBase-root': {
      fontFamily: 'Alata',
      color: 'var(--border-color)',
    },
    '& .MuiMenuItem-root': {
      fontFamily: 'Alata',
      color: 'var(--border-color)',
    },
    '& .MuiListItem-root': {
      fontFamily: 'Alata',
      color: 'var(--border-color)',
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
  const [wordPack, setWordPack] = React.useState('basic (easy)');
  const [sessionValue, setSessions] = React.useState(1);
  const [difficulty, setDifficulty] = React.useState('0.4');

  const handleWordpackChange = (event) => {
    setWordPack(event.target.value);
    post("/api/game/changedWordPack", {
      wordPack: event.target.value,
      game_id: props.game_id
    }).then(()=> {})
  };

 //changes the number of sessions
  const handleSessionValueChange = (event) => {
    setSessions(event.target.value);
    post("/api/game/changedSessions", {
      sessions: event.target.value,
      game_id: props.game_id
    }).then(()=> {})
  }

  //changes the difficulty
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    post("/api/game/changedDifficulty", {
      pixel_proportion: event.target.value,
      game_id: props.game_id
    }).then(()=> {})
  }

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
          value={sessionValue}
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
      <div>
        <TextField
          id="outlined-select-difficulty"
          select
          value={difficulty}
          onChange={handleDifficultyChange}
          helperText="pixels per player"
          variant="outlined"
        >
          {Object.keys(props.difficulties).map((key) => (
            <MenuItem key={key} value={props.difficulties[key]}>
              {key}
            </MenuItem>
          ))}
        </TextField>
        </div>
    </form>
  );
}
