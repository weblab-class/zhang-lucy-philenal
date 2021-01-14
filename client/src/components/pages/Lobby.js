import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { Link } from "@reach/router";
import { navigate } from "@reach/router";

// import TextEntry from "../modules/TextEntry.js";
import "../../utilities.css";
import "./Lobby.css";

import { get, post, put} from "../../utilities";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

const playersList = [
    {
    playername: "Lucy",
    _id: 1
  },
  {
    playername: "Bob",
    _id: 2
  },
  {
    playername: "Bob",
    _id: 3
  },
  {
    playername: "Bob",
    _id: 4
  }
  ];
  
const host = {
    playername: "Me",
    _id: "0"
  };
  

/**
 * Lobby page is what the user travels to after making/joining
 * a game. The host can start the game.
 * 
 * @param game_id
 * @param user_id 
 */
class Lobby extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
      players: [],
      host_id: null, //is host or not
    };
  }

  componentDidMount() {
    console.log("State:");
    console.log(this.props.location.state);
    // remember -- api calls go here!
    get("/api/game/get", {game_id: this.props.location.state.game_id})
    .then((res) => {
      console.log(res);
      console.log("HERE IS THE RES" + res[0].host_id);
      this.setState({
        players: res[0].players,
        // isHost: (this.props.location.state.user_id === res[0].host_id),
        host_id: res[0].host_id,
       });
    })
    .catch((err) => {
      console.log(err);
    })
    // console.log(this.props);
  }

  startGame = () => {
    console.log("GET request");
    get("/api/game/get", {game_id: this.props.location.state.game_id})
    .then((res) => {
      console.log(this.props.location.state.game_id);
      console.log(res); // list game objects

      // make a copy
      let game = {...res[0]};

      // start the game
      game.started = true;
      console.log("PUT request");
      put("/api/game/start", {game: game, game_id: this.props.location.state.game_id})
      .then((res) => {
        console.log(res)
        navigate("/pixeler", {state: {user_id: this.props.location.state.user_id, game_id: this.props.location.state.game_id}});
      })
      .catch((err) => {
        console.log(err)
      });
      

    })
    .catch((err) => {
      console.log(err);
    });
  }
  render() {
    
    let players = []
    for (let i = 0; i < this.state.players.length; i++) {
      players.push(
        <div className="PlayerPanelLeft-player">
          {this.state.players[i].name}
        </div>
      )
    } 
    console.log(this.props.location.state.user_id);
    console.log("host" + this.state.host_id)
    return (
      <>
            {/* TODO (philena) make this pretty! ^_^ */}
            {/* TODO add functionality for entering names too */}
            <div className="Lobby">
                <div className="Lobby-title">Lobby</div>
                <br></br>game ID: <b>{this.props.location.state.game_id}</b><br></br>
                {players}
                {(this.props.location.state.user_id === this.state.host_id) ? 
                    <button 
                    className="Lobby-startGame u-color-1"
                    onClick={()=> {this.startGame()}}>
                      start game
                      </button> :
                    <div></div>
                }
            </div>

      </>
    );
  }
}

export default Lobby;

// /* import React, { Component } from "react";
// import GoogleLogin, { GoogleLogout } from "react-google-login";
// import { Link } from "@reach/router";

// // import TextEntry from "../modules/TextEntry.js";
// import "../../utilities.css";
// import "./Lobby.css";

// import { get, post } from "../../utilities";


// //TODO: REPLACE WITH YOUR OWN CLIENT_ID
// const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

// const playersList = [
//     {
//     playername: "Lucy",
//     _id: 1
//   },
//   {
//     playername: "Bob",
//     _id: 2
//   },
//   {
//     playername: "Bob",
//     _id: 3
//   },
//   {
//     playername: "Bob",
//     _id: 4
//   }
//   ];
  
// /* const host = {
//     playername: "Me",
//     _id: "0"
//   }; */
  

// /**
//  * Lobby page is what the user travels to after making/joining
//  * a game. The host can start the game.
//  * 
//  * @param game_id
//  * @param user_id 
//  */
// class Lobby extends Component {
//   constructor(props) {
//     super(props);

//     // Initialize Default State
//     this.state = {
//       players: [],
//       /* isHost: false, //if user is host or not */
//     };
//   }

//   componentDidMount() {
//     console.log("State:");
//     console.log(this.props.location.state);
//     // remember -- api calls go here!
//     get("/api/game/get", {game_id: this.props.location.state.game_id})
//     .then((res) => {
//       console.log(res);
//       this.setState({
//         players: res[0].players,
//         isHost: (this.props.location.state.user_id === res[0].host_id),
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     })
//     // console.log(this.props);
//   }

//   startGame = () => {
//     console.log("GET request");
//     get("/api/game/get", {game_id: this.props.location.state.game_id})
//     .then((res) => {
//       console.log(this.props.location.state.game_id);
//       console.log(res); // list game objects

//       // make a copy
//       let game = {...res[0]};

//       // start the game
//       game.started = true;
//       console.log("PUT request");
//       put("/api/game/start", {game: game, game_id: this.props.location.state.game_id})
//       .then((res) => {
//         console.log(res)
//         navigate("/pixeler", {state: {user_id: this.props.location.state.user_id, game_id: this.props.location.state.game_id}});
//       })
//       .catch((err) => {
//         console.log(err)
//       });
      

//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   }

//   render() {
    
//     let players = []
//     for (let i = 0; i < this.state.players.length; i++) {
//       players.push(
//         <div className="PlayerPanelLeft-player">
//           {this.state.players[i].name}
//         </div>
//       )
//       console.log(this.props.location.state.user_id == host._id)
//     } 
//     return (
//       <>
//             {/* TODO (philena) make this pretty! ^_^ */}
//             {/* TODO add functionality for entering names too */}
//             <div className="Lobby">
//                 <div className="Lobby-title">Lobby</div>
//                 <br></br>game ID: <b>{this.props.location.state.game_id}</b><br></br>
//                 {players}
                
//                 {(this.state.isHost) ? 
//                     <button 
//                     className="Lobby-startGame u-color-1"
//                     onClick={()=> {this.startGame()}}>
//                       start game
//                       </button> :
//                     <div></div>
//                 }
//             </div>

//       </>
//     );
//   }
// }

// export default Lobby;
//  */
