import React from "react";
import {Board} from "./Board.js";
import {FrontBoard} from "./FrontBoard";
import {Cell} from "./Cell";

class Game extends React.Component {
    constructor(props) {
        super(props);

        const cells = Array(16).fill(null);

        this.state = {
            history: [{cells: cells}], //stores the history of moves. each state of cells stores degrees of '2'
            score: 0,
            least: 1,    //the least degree of '2' on the board
        }
    }

    renderCell(i) {
        return <Cell
            value="none"
            id_={i}
        />
    }

    renderRow(i) {
        const cells = [];
        for (let c = 0; c < 4; c++) {
            let cell_num = i*4 + c + 1;
            cells[c] = (
                <li key={"slot-" + cell_num}>{this.renderCell(cell_num)}</li>
            )
        }

        return (
            <div key={"row-" + i} className="board-row">
                <ol>{cells}</ol>
            </div>
        )
    }

    renderEmptyRow(i) {
        const cells = []
        for (let c = 0; c < 4; c++) {
            let cell_num = i*4 + c + 1;
            cells[c] = (
                <li key={"front-slot-" + cell_num}/>
            )
        }

        return (
            <div key={"front-row-" + i} className="board-row">
                <ol>{cells}</ol>
            </div>
        )
    }

    render() {
        return (
            <div className="game-space">
                <div className="game-panel">
                    <div className="score-block">
                        Очки:
                        <span id="score">{this.state.score}</span>
                    </div>
                    <div className="buttons-block">
                        <button id="goBack">
                            <svg width="16px" height="16px" viewBox="0 0 16 16" className="button-icon bi bi-arrow-counterclockwise"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M12.83 6.706a5 5 0 0 0-7.103-3.16.5.5 0 1 1-.454-.892A6 6 0 1 1 2.545 5.5a.5.5 0 1 1 .91.417 5 5 0 1 0 9.375.789z"/>
                                <path fillRule="evenodd"
                                      d="M7.854.146a.5.5 0 0 0-.708 0l-2.5 2.5a.5.5 0 0 0 0 .708l2.5 2.5a.5.5 0 1 0 .708-.708L5.707 3 7.854.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            Назад
                        </button>
                        <button id="newGame">
                            <svg width="16px" height="16px" viewBox="0 0 16 16" className="button-icon bi bi-arrow-repeat"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z"/>
                                <path fillRule="evenodd"
                                      d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z"/>
                            </svg>
                            Заново
                        </button>
                    </div>
                </div>
                <Board
                    id="backBoard"
                    renderCell={(i) => this.renderCell(i)}
                    renderRow={(i) => this.renderRow(i)}
                />
                <FrontBoard
                    id="frontBoard"
                    renderCell={(i) => this.renderCell(i)}
                    renderRow={(i) => this.renderRow(i)}
                    renderEmptyRow={(i) => this.renderEmptyRow(i)}
                />
            </div>
        )
    }
}

export {Game}

// ===============================

