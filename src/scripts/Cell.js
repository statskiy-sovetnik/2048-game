import React from "react";

class Cell extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <span className="cell-text">
                    {this.props.value}
                </span>
            </div>
        )
    }
}

export {Cell}
