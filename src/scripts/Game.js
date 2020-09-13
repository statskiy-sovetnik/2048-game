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
        this.BOARD_SIZE = this.CELL_SIZE * 4 + this.CELL_MARGIN * 5;

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

        //Current states of cells and cell shifts
        this.shifts = new Array(16).fill(null);
        this.cells = new Array(16).fill(null);

        //A property which turns on/off front cells animation
        this.animate_cells = true;

        //A lock which prevents from making a move
        this.move_lock = false;

        this.state = {
            history: [{cells: cells}], //stores the history of moves. each state of cells stores degrees of '2'
            score: 0,
            cell_state: new Array(16).fill(null),
            shifts_state: new Array(16).fill(null),
            least: 1,    //the least degree of '2' on the board
            step_num: 0,
            game_started: false,
            game_over: false,
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
            class_str += this.animate_cells ? "" : " no-animate";
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

        return (empty_slots.length === 0) ? null :
            empty_slots[Math.round(Math.random() * empty_slots.length)];
    }

    //Spawn a new cell at a random empty spot

    spawnCell(times) {
        let cur_cells = this.cells.slice();

        for(let i = 0; i < times; i++) {
            const slot_id = this.findEmptySlot(cur_cells);

            //Placing the least number on the empty slot
            if(slot_id != null) {
                cur_cells[slot_id] = Math.pow(2, this.state.least);
            }
        }

        this.cells = cur_cells;
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
        if(this.state.game_over) {
            this.cancelGameOver();
        }
        this.clearBoard();
        this.spawnCell(2);

        const cells = this.cells;
        this.setState({
            history: this.state.history.concat([{cells: cells}]),
            game_started: true,
            step_num: 1
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
                onClick={() => {gameStarted ? this.makeMove(side, [0, 0], true) : this.startGame()}}
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

    mergeCells(from, to, moving_cell) {  //returns a new born value
        const direction = this.defineDirctn(from, to);
        let cur_shifts = this.shifts.slice();
        let cur_cells = this.cells.slice();
        let shift_size = this.getCurrentShift(moving_cell);
        let new_value;

        switch (direction) {
            case 0:
                cur_shifts[moving_cell] = "top-" + (shift_size + 1);
                break;
            case 1:
                cur_shifts[moving_cell] = "right-" + (shift_size + 1);
                break;
            case 2:
                cur_shifts[moving_cell] = "bottom-" + (shift_size + 1);
                break;
            case 3:
                cur_shifts[moving_cell] = "left-" + (shift_size + 1);
                break;
            default:
                cur_shifts[moving_cell] = "top-" + (shift_size + 1);
        }

        cur_cells[to] = +cur_cells[from] * 2;
        cur_cells[from] = null;
        new_value = cur_cells[to];
        this.cells = cur_cells;
        this.shifts = cur_shifts;

        return new_value;
    }

    defineDirctn(from, to) {
        const row_1 = Math.floor(from / 4),
            row_2 = Math.floor(to / 4),
            col_1 = from % 4,
            col_2 = to % 4;

        if(row_1 === row_2) {
            if(col_1 > col_2) {
                return 3;
            }
            else {
                return 1;
            }
        }
        else {
            if(row_1 > row_2) {
                return 0;
            }
            else {
                return 2;
            }
        }
    }

    moveCell(from, to, moving_cell) {
        //определить направление

        const direction = this.defineDirctn(from, to);
        let cur_shifts = this.shifts.slice();
        let cur_cells = this.cells.slice();
        let shift_size = this.getCurrentShift(moving_cell);

        switch (direction) {
            case 0:
                cur_shifts[moving_cell] = "top-" + (shift_size + 1);
                break;
            case 1:
                cur_shifts[moving_cell] = "right-" + (shift_size + 1);
                break;
            case 2:
                cur_shifts[moving_cell] = "bottom-" + (shift_size + 1);
                break;
            case 3:
                cur_shifts[moving_cell] = "left-" + (shift_size + 1);
                break;
            default:
                cur_shifts[moving_cell] = "top-" + (shift_size + 1);
        }

        cur_cells[to] = cur_cells[from];
        cur_cells[from] = null;
        this.shifts = cur_shifts;
        this.cells = cur_cells;
    }

    getCurrentShift(cell) {
        const cur_shifts = this.shifts.slice();
        let cur_multi_shift = cur_shifts[cell];
        return cur_multi_shift ? +cur_multi_shift[cur_multi_shift.length - 1] : 0;
    }

    calcScore(cells) {
        let score = 0;
        for(let value of cells) {
            score += +value;
        }
        return score;
    }

    calcLeastDeg(cells) {
        let least_value = 2048;
        let least_deg;
        for(let value of cells) {
            if(value == null) {continue}
            least_value = (value <= least_value) ? +value : least_value;
        }
        least_deg = Math.floor(Math.log2(least_value));
        least_deg = (this.state.step_num >= 100 * least_deg || least_deg < 2) ? least_deg : least_deg - 1;
        return least_deg;
    }

    correctMovingCell(moving_cell, cur_row, move_directn) {
        let cur_mc_shift = this.getCurrentShift(moving_cell);
        let mc_row_ind;
        switch (move_directn) {
            case 0:
                mc_row_ind = Math.floor(moving_cell / 4) - cur_mc_shift;
                break;
            case 1:
                mc_row_ind = 3 - (moving_cell % 4) - cur_mc_shift;
                break;
            case 2:
                mc_row_ind = 3 - Math.floor(moving_cell / 4) - cur_mc_shift;
                break;
            case 3:
                mc_row_ind = Math.floor(moving_cell % 4) - cur_mc_shift;
                break;
        }

        //If you can't move current moving cell anymore, you have to change it
        if(mc_row_ind === 0 ||
            (cur_row[mc_row_ind - 1] != null && cur_row[mc_row_ind - 1] !== cur_row[mc_row_ind])){
            moving_cell = null;
        }
        else {
        }

        return moving_cell;
    }

    getSurroundingCells(cell_id, cells) {
        let nearby_cells = [];
        if(cell_id % 4 !== 3) {  //if the cell IS NOT IN LAST COLUMN
            nearby_cells.push(cells[cell_id + 1]);
        }
        if(Math.floor(cell_id / 4) !== 3) { //if the cell IS NOT IN LAST ROW
            nearby_cells.push(cells[cell_id + 4]);
        }
        if(cell_id % 4 !== 0) {
            nearby_cells.push(cells[cell_id - 1]);
        }
        if(Math.floor(cell_id / 4) !== 0) {
            nearby_cells.push(cells[cell_id - 4]);
        }
        return nearby_cells;
    }

    isGameOver(cells, cells_after_spawn) {
        let cur_id;

        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                cur_id = i*4 + j;
                if(cells_after_spawn[cur_id] == null) {
                    return false;
                }
            }
        }

        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                cur_id = i*4 + j;
                let cur_nearby_cells = this.getSurroundingCells(cur_id, cells_after_spawn);
                console.log(cur_id + " nearby cells: " + cur_nearby_cells);
                console.log(cells_after_spawn[cur_id]);
                for(let c = 0; c < cur_nearby_cells.length; c++) {
                    if(cells_after_spawn[cur_id] === cur_nearby_cells[c]) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    showGameOver() {
        document.querySelector(".game-space").classList.add("game-over");
    }

    cancelGameOver() {
        this.setState({
            game_over: false,
        })
        document.querySelector(".game-space").classList.remove("game-over");
    }

    renderGameOverPanel() {
        return (
          <div
              className="game-over-panel"
          >
              Конец игры!
          </div>
        );
    }

    makeMove(side) {
        if(this.move_lock || this.state.game_over) {
            console.log("Locked or game over!");
            return;
        }

        let cells;
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

        //Take each row/column
        for(let i = 0; i < 4; i++) {

            let neighbr_cells = {}, first, second;
            let moving_cell = null;
            let cur_row;

            for(let j = 0; j < 3; j++) {

                cells = this.cells.slice();

                //A current row (or column) of board values
                cur_row = cells_indeces[i].map((cell_ind) => {
                    return cells[cell_ind];
                });

                //Finding a cell which we can move
                if(moving_cell == null) {
                    for(let c = 0; c < 4; c++) {
                        if (cur_row[c] !== null && c !== 0 &&
                            (cur_row[c-1] == null || cur_row[c-1] === cur_row[c])) {
                            moving_cell = cells_indeces[i][c];
                            break;
                        }
                    }
                }

                //Taking next two cells to check
                neighbr_cells = this.takeTwoCells(cur_row, j);
                first = neighbr_cells.indeces[0];
                second = neighbr_cells.indeces[1];
                const from = cells_indeces[i][3-second];
                const to = cells_indeces[i][3-first];

                if(neighbr_cells[second] != null) {  //"from" is not empty
                    if(neighbr_cells[first] != null) {  //"to" is not empty
                        if(neighbr_cells[first] === neighbr_cells[second]) {  //merging two cells
                            this.mergeCells(from, to, moving_cell);

                            cells = this.cells.slice();
                            cur_row = cells_indeces[i].map((cell_ind) => {
                                return cells[cell_ind];
                            });
                            let move_direction = this.defineDirctn(from, to);
                            moving_cell = this.correctMovingCell(moving_cell, cur_row, move_direction);

                            j = -1;
                        }
                        else {
                            /*do nothing*/
                        }
                    }
                    else { //moving one cell to the empty slot

                        this.moveCell(from, to, moving_cell);

                        cells = this.cells.slice();
                        cur_row = cells_indeces[i].map((cell_ind) => {
                            return cells[cell_ind];
                        });
                        let move_direction = this.defineDirctn(from, to);
                        moving_cell = this.correctMovingCell(moving_cell, cur_row, move_direction);

                        j = -1;
                    }
                }
            }

        }

        cells = this.cells;
        const cur_shifts = this.shifts.slice();
        this.move_lock = true;
        const least_deg = this.calcLeastDeg(cells);

        this.setState({
            shifts_state: cur_shifts,
            score: this.calcScore(cells),
            step_num: this.state.step_num + 1,
            least: least_deg,
        }, () => {
            setTimeout(() => {
                this.animate_cells = false;
                this.spawnCell(1);
                const cells_after_spawn = this.cells.slice();
                console.log("After spawn: " + cells_after_spawn);
                const game_over = this.isGameOver(cells, cells_after_spawn);

                this.setState({
                    history: this.state.history.concat([{cells: cells_after_spawn}]),
                    cell_state: cells_after_spawn.slice(),
                    shifts_state: new Array(16).fill(null),
                    game_over: game_over,
                }, () => {
                    this.shifts = new Array(16).fill(null);
                    this.cells = cells_after_spawn.slice();
                    this.animate_cells = true;
                    this.move_lock = false;
                })
            }, 110);
        });


    }

    clearBoard() {
        this.cells = new Array(16).fill(null);
        this.shifts = new Array(16).fill(null);

        this.setState({
            cell_state: new Array(16).fill(null),
            shifts_state: new Array(16).fill(null),
            history: [{cells: new Array(16).fill(null)}], //stores the history of moves. each state of cells stores degrees of '2'
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

        if(this.state.game_over) {
            this.cancelGameOver();
        }

        this.cells = this.state.history[this.state.history.length - 2].cells.slice();
        this.setState({
            history: this.state.history.slice(0, this.state.history.length - 1),
            step_num: moves - 1,
            score: this.calcScore(this.cells),
        })
    }

    render() {
        const game_guide = !this.state.game_started ?
            "Нажмите \"Начать\", чтобы создать первые клетки" :
            "Нажмите на одну из кнопок со стрелками, чтобы переместить клетки";
        const game_started = this.state.game_started;
        const game_over = this.state.game_over;
        const game_over_panel = game_over ? this.renderGameOverPanel() : null;
        if(game_over) {
            this.showGameOver();
        }

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
                {game_over_panel}
            </div>
        )
    }
}

export {Game}

// ===============================

