import React, { Component } from "react";
import "../../utilities.css";
import "../../variables.scss";
import "./StartMenu.css";
import "./TextEntry.css";



/**
 * Generic TextEntry component
 * @param callback callback function to parent component (onGuessEntry --> sets state of guess in parent)
 * @param className the styling
 * @param onSubmit submitGuess() --> api calls to document guess in PlayerPanelRight.js
 */
class TextEntry extends Component {
  constructor(props) {
    super(props);
    if (this.props.clear) {
      this.props.cleared();
    }
    // Initialize Default State
    this.state = {
        text: "",
        disableButton: false,
    };
  }

  componentDidMount() {
 
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onEnterKeyPress(this.state.text);

    this.props.onSubmit && this.props.onSubmit(this.state.text);
    this.setState({
      text: "",
    });
  };

  onCorrectGuess = (event) => {
    // TODO
  }

  onKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.handleSubmit(event);
    }
  }

  onTextChange = (event) => {
    this.setState({
      text: event.target.value,
    })
    this.props.callback(event.target.value);
  }

  render() {

    return (
      <>
        <form>
        <input
            type='text'
            className='TextEntry-underline'
            value={this.state.text}
            onChange={this.onTextChange}
            onKeyPress={this.onKeyPress}
        />
        </form>
      </>
    );
  }
}

export default TextEntry;
