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

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <Fade in={open}>
          <div className={classes.paper}>
            <DialogTitle id="alert-dialog-title">{props.overlayText}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {props.theWordWas}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose && props.callback} color="primary">
            {props.callbackButtonText}
            </Button>
            </DialogActions>
            </div>
          </Fade>
        </Dialog>
    </div>
  );
}
