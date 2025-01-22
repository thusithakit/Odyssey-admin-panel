import * as React from 'react'

function Loader() {
    return (
        <div id="wrapper">
            <div className="spinner">
                <div className="loading-container">
                    <div className="ball"></div>
                    <div className="ball-inner"></div>
                </div>
                <p className="ball-text">loading</p>
            </div>
        </div>
    )
}

export default Loader
