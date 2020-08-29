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
            step_num: 0,
            game_started: false,
        }
    }

    renderCell(i, value, class_str) {
        return <Cell
            value={value}
            id_={i}
            className={"cell " + class_str}
        />
    }

    renderRow(i) {
        const cells = [];
        for (let c = 0; c < 4; c++) {
            let cell_num = i*4 + c;
            cells[c] = (
                <li key={"slot-" + cell_num}>{this.renderCell(cell_num, null, "empty")}</li>
            )
        }

        return (
            <div key={"row-" + i} className="board-row">
                <ol>{cells}</ol>
            </div>
        )
    }

    renderFrontRow(i) {
        const cur_state = {};
        Object.assign(cur_state, this.state.history[this.state.history.length - 1]);
        const cur_cells = cur_state.cells;
        const cells = [];

        for (let c = 0; c < 4; c++) {
            let cell_num = i*4 + c;
            let class_str = (cur_cells[cell_num] == null) ? "empty" : "visible value-" + cur_cells[cell_num];
            cells[c] = (
                <li key={"cell-" + cell_num}>
                    {this.renderCell(cell_num, cur_cells[cell_num], class_str) }
                </li>
            )
        }

        return (
            <div key={"front-row-" + i} className="board-row">
                <ol>{cells}</ol>
            </div>
        )
    }

    findEmptySlot() {
        const empty_slots = [];
        const cur_state = {};
        Object.assign(cur_state, this.state.history[this.state.history.length - 1]);
        const cur_cells = cur_state.cells;

        let cur_ind = 0;
        for(let ind = 0; ind < cur_cells.length; ind++) {
            if(cur_cells[ind] == null) {
                empty_slots[cur_ind] = ind;
                cur_ind++;
            }
        }

        let slot_id = 0;
        while(empty_slots.indexOf(slot_id) === -1) {
            slot_id = Math.round(Math.random() * 15);
        }
        return slot_id;
    }

    //Spawn a new cell at a random empty spot

    spawnCell() {
        const slot_id = this.findEmptySlot();
        const cur_state = {};
        Object.assign(cur_state, this.state.history[this.state.history.length - 1]);
        const cur_cells = cur_state.cells;

        //Placing the least number on the empty slot

        cur_cells[slot_id] = Math.pow(2, this.state.least);
        this.setState({
            history: this.state.history.concat([{cells: cur_cells}])
        });
    }

    startBtnContent(game_started) {
        if(game_started) {
            return (
                <button id="newGame"
                        onClick={() => this.startGame()}>
                    <svg width="16px" height="16px" viewBox="0 0 16 16" className="button-icon bi bi-arrow-repeat"
                         fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z"/>
                        <path fillRule="evenodd"
                              d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z"/>
                    </svg>
                    Заново
                </button>
            )
        }
        else {
            return (
                <button
                    id="newGame"
                    onClick={() => this.startGame()}
                >
                    Начать
                </button>)
        }
    }

    startGame() {
        this.clearBoard();

        this.setState({
            game_started: true,
            step_num: 1
        }, () => {
            this.spawnCell();
            this.spawnCell();
        })
    }

    renderArrowBtn(gameStarted, side) {
        //sides: 0 - top, 1 - right, 2 - bottom, 3 - left
        const sides = ["up", "right", "down", "left"];
        const icon_size = "16px";
        const icons=[
            //Up
            <svg width={icon_size} height={icon_size} viewBox="0 0 16 16" className="bi bi-arrow-up-short" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
            </svg>,
            //Right
            <svg width={icon_size} height={icon_size} viewBox="0 0 16 16" className="bi bi-arrow-right-short" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
            </svg>,
            //Down
            <svg width={icon_size} height={icon_size} viewBox="0 0 16 16" className="bi bi-arrow-down-short" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
            </svg>,
            //Left
            <svg width={icon_size} height={icon_size} viewBox="0 0 16 16" className="bi bi-arrow-left-short" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
            </svg>
        ];

        return (
            <button
                id={sides[+side]}
                onClick={() => {gameStarted ? this.makeMove(side) : this.startGame()}}
                className="move-arrow"
            >
                {icons[+side]}
            </button>
        );
    }

    makeMove(side) {
        alert("Move: " + side)
    }

    clearBoard() {
        this.setState({
            history: [{cells: Array(16).fill(null)}], //stores the history of moves. each state of cells stores degrees of '2'
            score: 0,
            least: 1,    //the least degree of '2' on the board
            step_num: 0,
            game_started: false,
        })
    }

    goBack() {
        const moves = this.state.step_num;

        if(moves <= 1) {
            return;
        }

        this.setState({
            history: this.state.history.slice(0, this.state.history.length - 1),
            step_num: moves - 1,
        })
    }

    render() {
        const game_guide = !this.state.game_started ?
            "Нажмите \"Начать\", чтобы создать первые клетки" :
            "Нажмите на одну из кнопок со стрелками, чтобы переместить клетки";
        const game_started = this.state.game_started;

        return (
            <div className="game-space">
                {game_guide}
                <div className="game-panel">
                    <div className="score-block">
                        Очки:
                        <span id="score">{this.state.score}</span>
                    </div>
                    <div className="buttons-block">
                        <button id="goBack"
                                onClick={() => this.goBack()}
                        >
                            <svg width="16px" height="16px" viewBox="0 0 16 16" className="button-icon bi bi-arrow-counterclockwise"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M12.83 6.706a5 5 0 0 0-7.103-3.16.5.5 0 1 1-.454-.892A6 6 0 1 1 2.545 5.5a.5.5 0 1 1 .91.417 5 5 0 1 0 9.375.789z"/>
                                <path fillRule="evenodd"
                                      d="M7.854.146a.5.5 0 0 0-.708 0l-2.5 2.5a.5.5 0 0 0 0 .708l2.5 2.5a.5.5 0 1 0 .708-.708L5.707 3 7.854.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            Назад
                        </button>
                        {this.startBtnContent(this.state.game_started)}
                    </div>
                </div>
                <div className="arrows-block">
                    {this.renderArrowBtn(game_started, 0)}
                    <div className="middle-arrows-block">
                        {this.renderArrowBtn(game_started, 3)}
                        {this.renderArrowBtn(game_started, 1)}
                    </div>
                    {this.renderArrowBtn(game_started, 2)}
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
                    renderFrontRow={(i) => this.renderFrontRow(i)}
                />
            </div>
        )
    }
}

export {Game}

// ===============================

