import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import "../../utilities.css";
import { socket } from "../../client-socket.js";
//code adapted from material ui
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0
  },
}));

export default function TransitionsModal(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=> {
      if (props.overlayText !== "") {
          setOpen(true);
      }
  },[props.overlayText]);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div style={modalStyle} className={classes.paper}>
            <h2 id="transition-modal-title">{props.overlayText}</h2>
            <h3 id="transition-modal-description">{props.theWordWas}</h3>
           {/*  <button 
              className="transitiion-modal-button u-pointer" 
              onClick={handleClose&& props.callback}
            >
              {props.callbackButtonText}
            </button> */}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
