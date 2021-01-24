import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
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

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
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
            <DialogTitle id="alert-dialog-title">{props.overlayText}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {props.theWordWas}
            </DialogContentText>
            </DialogContent>
            {/* you can only see this next word or end game button if you're guesser
            and haven't ended game */}
            {props.isGuesser && !props.endGame ?
            <DialogActions>
              <Button onClick={handleClose && props.callback} color="primary">
              {props.callbackButtonText}
              </Button>
            </DialogActions>: <div></div>
            }
            {/* if you're at the end game */}
            {props.endGame ?  
            <DialogActions>
              <Button onClick={handleClose && goToWall} color="primary">
              my wall
              </Button>
              <Button onClick={handleClose && leaveGame} color="primary">
              leave
              </Button>
            </DialogActions>: <div></div>}
            </div>
          </Fade>
        </Dialog>
    </div>
  );
}
