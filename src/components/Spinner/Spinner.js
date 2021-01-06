import React from 'react';
import './Spinner.scss'

const Spinner = ({ height = '50px', width = '54px' }) => {

    const spinnerStyle = {
        height,
        width,
    }

    return(
        <div className='spinner' style={spinnerStyle}></div>
    )
}

export default Spinner;