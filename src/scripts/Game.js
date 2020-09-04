import React from "react";
import {Board} from "./Board.js";
import {FrontBoard} from "./FrontBoard";
import {Cell} from "./Cell";

class Game extends React.Component {
    constructor(props) {
        super(props);

        const cells = Array(16).fill(null);

        this.up_move_indeces = new Array(4);
        this.down_move_indeces = new Array(4);
        this.right_move_indeces = new Array(4);
        this.left_move_indeces = new Array(4);

        this.CELL_MARGIN = 7;
        this.CELL_SIZE = 60;

        //Setting the indeces arrays _______________

        for(let i = 0; i < 4; i++){
            this.down_move_indeces[i] = new Array(4);
            this.up_move_indeces[i] = new Array(4);
            this.right_move_indeces[i] = new Array(4);
            this.left_move_indeces[i] = new Array(4);
            for(let c = 0; c < 4; c++) {
                this.down_move_indeces[i][c] = (3-c)*4 + i;
                this.up_move_indeces[i][c] = c*4 + i;
                this.left_move_indeces[i][c] = i*4 + c;
                this.right_move_indeces[i][c] = i*4 + 3 - c;
            }
        }

        //Current states of cells and shifts (you need them toa avoid asynchronous updates of state

        const shifts_state = new Array(16).fill(null);
        const cell_state = new Array(16).fill(null);

        this.state = {
            history: [{cells: cells}], //stores the history of moves. each state of cells stores degrees of '2'
            shifts_state: shifts_state,
            cell_state: cell_state,
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
        const cur_shifts = this.state.shifts_state.slice();
        const cells = [];

        for (let c = 0; c < 4; c++) {
            let cell_num = i*4 + c;
            let class_str = (cur_cells[cell_num] == null) ? "empty" : "visible value-" + cur_cells[cell_num];
            class_str += (cur_shifts[cell_num]) ? " shift-" + cur_shifts[cell_num] : "";
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

    findEmptySlot(cells) {
        const empty_slots = [];
        /*const cur_state = {};
        Object.assign(cur_state, this.state.history[this.state.history.length - 1]);*/

        let cur_ind = 0;
        for(let ind = 0; ind < cells.length; ind++) {
            if(cells[ind] == null) {
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

    spawnCell(times) {
        let cur_cells = this.state.cell_state.slice();

        for(let i = 0; i < times; i++) {
            const slot_id = this.findEmptySlot(cur_cells);

            //Placing the least number on the empty slot
            cur_cells[slot_id] = Math.pow(2, this.state.least);
            console.log("Slot " + slot_id);
        }

        this.setState({
            cell_state: cur_cells, //when a cell spawns, it doesn't update the whole history, so that when you
                                   //go the the previous move, it woudn't just remove the cell
        }, () => {
            console.log(this.state.cell_state);
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
            this.spawnCell(2);

            const cells = this.state.cell_state;
            
            this.setState({
                history: this.state.history.concat([{cells: cells}]),
            }, () => {
                console.log("History changed: " + cells);
            });
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

    takeTwoCells(cur_row, start_ind) {
        let c = 0;
        let neigbr_cells = {};
        neigbr_cells.indeces = new Array(2).fill(null);
        for(let j = 3-start_ind; j >= 0 && c < 2; j--) {
            neigbr_cells[j] = cur_row[3-j];
            neigbr_cells.indeces[c] = j;
            c++;
        }

        return neigbr_cells;
    }

    mergeCells(from, to) {
    }

    removeCell(ind) {

    }

    moveCell(from, to) {
        //определить направление
        const row_1 = Math.floor(from / 4),
              row_2 = Math.floor(to / 4),
              col_1 = from % 4,
              col_2 = to % 4;

        /*let cur_state = {};
        Object.assign(cur_state, this.state.history[this.state.history.length - 1]);*/
        let cur_shifts = this.state.shifts_state.slice();
        let cur_cells = this.state.cell_state.slice();
        console.log("From: " + from + " To: " + to);

        if(row_1 === row_2) {
            if(col_1 > col_2) { //shift "from" to the left
                console.log(from + "shifts right");
                cur_shifts[from] = "left";
            }
            else { //to the right
                cur_shifts[from] = "right";
                console.log(from + "shifts left");
            }
        }
        else {
            if(row_1 > row_2) { //shift down
                cur_shifts[from] = "top";
                console.log(from + "shifts down");
            }
            else {// up
                console.log(from + "shifts up");
                cur_shifts[from] = "bottom";
            }
        }

        console.log("Cell state BEFORE: " + cur_cells);
        cur_cells[to] = cur_cells[from];
        cur_cells[from] = null;

        this.setState({
            cell_state: cur_cells,
            shifts_state: cur_shifts,
        }, () => {
            console.log("Cell state AFTER: " + cur_cells);
        });

    }

    makeMove(side) {
        let cells = this.cell_state.slice();
        let cells_indeces = [];

        switch (+side) {
            case 0:
                cells_indeces = this.up_move_indeces;
                break;
            case 1:
                cells_indeces = this.right_move_indeces;
                break;
            case 2:
                cells_indeces = this.down_move_indeces;
                break;
            case 3:
                cells_indeces = this.left_move_indeces;
                break;
            default:
                cells_indeces = this.up_move_indeces;
        }

        for(let i = 0; i < 4; i++) {

            //The algorithm looks like bubble sort. We merge or shift sells until they
            // are all different and on one side

            for(let s = 0; s < 4; s++) {
                //Take two neighboring not empty cells

                let neighbr_cells = {}, first, second;
                for(let j = 0; j < 3; j++) {
                    cells = this.cell_state.slice();

                    //A current row (or column) of board values

                    let cur_row = cells_indeces[i].map((cell_ind) => {
                        return cells[cell_ind];
                    });
                    console.log("Row: " + cur_row);

                    neighbr_cells = this.takeTwoCells(cur_row, j);
                    first = neighbr_cells.indeces[0];
                    second = neighbr_cells.indeces[1];
                    console.log(neighbr_cells);

                    if(neighbr_cells[second] != null) {
                        if(neighbr_cells[first] != null) {
                            if(neighbr_cells[first] === neighbr_cells[second]) {
                                this.mergeCells(cells_indeces[i][3-first], cells_indeces[i][3-second]);
                            }
                        }
                        else {
                            this.moveCell(cells_indeces[i][3-second], cells_indeces[i][3-first])
                        }
                    }
                }
            }

        }
    }

    clearBoard() {
        this.cell_state = new Array(16).fill(null);
        this.shifts_state = new Array(16).fill(null);

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

        this.cell_state = this.state.history[this.state.history.length - 2].cells.slice();
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

