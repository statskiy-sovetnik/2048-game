import React from "react";
import ReactDOM from "react-dom";
import {Board} from "./Board.js";

class Game extends React.Component {
    render() {
        return (
            <div className="game-space">
                2048 eeee
            </div>
        )
    }
}


// ===============================

ReactDOM.render(
    (<Game />),
    document.getElementById('root')
);