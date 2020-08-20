import React from "react";
import {Cell} from "./Cell";

class Board extends React.Component {
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
                <li key={"cell-" + cell_num}>{this.renderCell(cell_num)}</li>
            )
            console.log(cells[c]);
        }

        return (
            <div key={"row-" + i} className="board-row">
                <ol>{cells}</ol>
            </div>
        )
    }

    render() {
        const rows_n = 4;
        const rows = Array(rows_n).fill(null).map((c, ind) => {
            return this.renderRow(ind);
        });

        return (
            <div className="board-row-wrapper">
                {rows}
            </div>
        );
    }
}

export {Board};
