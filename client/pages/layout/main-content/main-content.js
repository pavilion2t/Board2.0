import './main-content.scss';

import React, { PropTypes } from 'react';

function MainContent(props) {
    let { className = '', transparent } = props;
    let style = {};
    if (transparent) {
        style.background = 'transparent';
    }
    return (
        <div className={ `main-content ${className}` } style={ style }>
            { props.children }
        </div>
    );
}

MainContent.propTypes = {
    className: PropTypes.string,
    transparent: PropTypes.bool,
    children: PropTypes.node,
};

export default MainContent;