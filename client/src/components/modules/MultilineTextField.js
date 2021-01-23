import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { get, post, put} from "../../utilities";



const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
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
  const [wordPack, setWordPack] = React.useState('basic');
  const [sessions, setSessions] = React.useState(1);

  const handleChange = (event) => {
    setWordPack(event.target.value);
    post("/api/game/changedWordPack", {
      wordPack: event.target.value,
      game_id: props.game_id
    }).then(()=> console.log("I changed my word pack"))
  };

 //changes the number of sessions
  const handleTextFieldChange = (event) => {
    setSessions(event.target.value);
    post("/api/game/changedSessions", {
      sessions: event.target.value,
      game_id: props.game_id
    }).then(()=> console.log("I changed my sessions"))
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="outlined-select-wordPack"
          select
          label="Select"
          value={wordPack}
          onChange={handleChange}
          helperText="please select your word pack"
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
          label="Number"
          type="number"
          InputProps={{ inputProps: { min: 1, max: 10 } }}
          helperText="please choose the # of rounds"
          onChange={handleTextFieldChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </form>
  );
}
