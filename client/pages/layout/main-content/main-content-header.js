import './main-content-header.scss';

import React, { PropTypes } from 'react';

function MainContentHeader(props) {
    let { className = '', title, children } = props;
    return (
        <header className={ `main-content-header columns ${className}` }>
            {
                !title ? null : <h1 className="main-content-title columns-main">{ title }</h1>
            }
            <div>{ children }</div>
        </header>
    );
}

MainContentHeader.propTypes = {
    className: PropTypes.string,
    title: PropTypes.node,
    children: PropTypes.node,
};

export default MainContentHeader;