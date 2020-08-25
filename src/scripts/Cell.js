import React from "react";

class Cell extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                {this.props.value}
            </div>
        )
    }
}

export {Cell}
