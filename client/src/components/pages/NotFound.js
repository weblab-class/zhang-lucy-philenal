import React, { Component } from "react";

/**
 * This is the page view when the user reaches an invalid URL
 */
class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>The page you requested couldn't be found.</p>
        {/* why this not working i'm sad */}
        {/* <img src="/client/src/components/resources/404_sad.jpg" alt="sad animal crying over your 404"></img> */}
      </div>
    );
  }
}

export default NotFound;
