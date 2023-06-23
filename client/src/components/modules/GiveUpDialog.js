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
@param _id
@param user_name
@param game_id
 */
export default function GiveUpDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(()=> {
    if (props.givingUp) {
        setOpen(true);
    }
},[props.givingUp]);


  const handleClose = () => {
    setOpen(false);
  };



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
            <div className={classes.title}>are you sure?</div>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            the word will be revealed if you give up
            </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button onClick={handleClose && props.callback(true)} >
              yes, i give up
              </button>
              <button onClick={handleClose && props.callback(false)} >
              cancel
              </button>
            </DialogActions>
            </div>
          </Fade>
        </Dialog>
    </div>
  );
}