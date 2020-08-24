import React from "react";

class FrontBoard extends React.Component {

    render() {
        const rows = Array(4).fill(null).map((c, ind) => {
            return this.props.renderEmptyRow(ind);
        });

        return (
            <div id={this.props.id} className="board-row-wrapper">
                {rows}
            </div>
        );
    }
}

export {FrontBoard};