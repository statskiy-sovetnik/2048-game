import React from "react";
import {Board} from "./Board.js";

class Game extends React.Component {
    render() {
        return (
            <div className="game-space">
                <Board/>
            </div>
        )
    }
}

export {Game}

// ===============================

