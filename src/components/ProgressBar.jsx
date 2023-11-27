import React from 'react';

function ProgressBar(props) {

    const styleprops = {
        width: props.now + '%'
    }
    return (
        <div className="progressBar-wrapper">
            <div 
                className="progressBar"
                aria-valuenow={props.now}
                aria-valuemin="0"
                aria-valuemax="100"
                style={styleprops}>
            </div>
        </div>
    );
}

export default ProgressBar;