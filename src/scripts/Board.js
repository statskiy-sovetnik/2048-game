import React from "react";

class Board extends React.Component {

    render() {
        const rows_n = 4;
        const rows = Array(rows_n).fill(null).map((c, ind) => {
            return this.props.renderRow(ind);
        });

        return (
            <div className="board-row-wrapper">
                {rows}
            </div>
        );
    }
}

export {Board};
