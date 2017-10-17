import './main-content-filter.scss';

import React, { PropTypes } from 'react';

function MainContentHeader(props) {
    let { className = '', children } = props;
    return (
        <div className={ `main-content -main-filter ${className}` }>
            { children }
        </div>
    );
}

MainContentHeader.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default MainContentHeader;