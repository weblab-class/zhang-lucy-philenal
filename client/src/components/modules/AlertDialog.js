import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import "../../utilities.css";
import DialogTitle from '@material-ui/core/DialogTitle';
import { navigate } from "@reach/router";
import { get, post, put} from "../../utilities";

const useStyles = makeStyles({
  root: {
    '& .MuiButton-root': {
      textTransform: 'lowercase !important',
    },
      backgroundColor: '#efefef !important',
      color: 'rgb(100, 100, 100) !important',
    },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: '16px 24px',
    fontSize: '24px',
    flex: '1 1 auto',
  },
  paper: {
    
   /*  color: 'rgb(100, 100, 100) !important', */
    outline: 0,
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 3px',
    borderWidth: '0.5em',
    borderRadius: '1em',
  },
  
});
/* props:
@param endGame - boolean if game ended
@param isGuesser
@param overlayText
@param theWordWas - what to put in paragraph text
@param callback
@param callbackButtonText
@param user_id
@param user_name
@param game_id
 */
export default function AlertDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(()=> {
    if (props.overlayText !== "") {
        setOpen(true);
    }
},[props.overlayText]);


  const handleClose = () => {
    setOpen(false);
  };

  const leaveGame = () => {
    post("/api/user/leave", {
      user_id: props.user_id,
      game_id: props.game_id,
    }).then((res) => {
      if (res.success) { 
        navigate("/");
      }
    })
  }

  const goToWall = () => {
    post("/api/user/leave", {
      user_id: props.user_id,
      game_id: props.game_id,
    }).then((res) => {
      if (res.success) { 
        navigate("/wall", {state: {
          user_id: props.user_id, 
          user_name: props.user_name
        }});
      }
    })
  }


  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick={true}
      >
          <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.title}>{props.overlayText}</div>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {props.theWordWas}
            </DialogContentText>
            </DialogContent>
            {/* you can only see this next word or end game button if you're guesser
            and haven't ended game */}
            {props.isGuesser && !props.endGame ?
            <DialogActions>
              <button onClick={handleClose && props.callback} >
              {props.callbackButtonText}
              </button>
            </DialogActions>: <div></div>
            }
            {/* if you're at the end game */}
            {props.endGame ?  
            <DialogActions>
              <button onClick={handleClose && goToWall} >
              my wall
              </button>
              <button onClick={handleClose && leaveGame} >
              leave
              </button>
            </DialogActions>: <div></div>}
            </div>
          </Fade>
        </Dialog>
    </div>
  );
}
