import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GuesserIcon from "../modules/panels/GuesserIcon";
import PlayerOrder from "../modules/panels/PlayerOrder";
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '300px',
    padding: '8px',
    display: 'flex',
    margin: 'auto',
  },
  title: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: '16px 24px',
    fontSize: '24px',
    flex: '1 1 auto',
  },
  
}));

export default function PlayerAccordion(props) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:1150px)');
  if (matches){
    return (
        <div className={classes.root}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.title}>game details</div>
            </AccordionSummary>
            <div>
            <div className="PlayerPanelLeft-header">word: 
                  <span className="PlayerPanelLeft-word">
                    {(props.word)}
                  </span>
                </div>
                <div className="PlayerPanelLeft-header">round:  
                  <span className="PlayerPanelLeft-round">
                    {props.round} of {props.maxSessions}
                  </span>
                </div>
                <div className="PlayerPanelLeft-header">guesser:</div>
                <GuesserIcon 
                  guesser_name={props.guesser.name} 
                  _id={props.guesser._id} 
                  game_id={props.game_id}
                  isMyTurn={props.turn===props.pixelers.length}/>
                <div className="PlayerPanelLeft-header">pixelers:</div>
                <PlayerOrder 
                  game_id={props.game_id}
                  pixelers={props.pixelers} 
                  turn={props.turn}
                />
            </div>
          </Accordion>
        </div>
      );
  } else {
      return (<div></div>)
  }
  
}
