import './main-content-section.scss';

import React, { PropTypes } from 'react';

function MainContentSection(props) {
    let { className = '' } = props;
    return (
        <div className={ `main-content-section ${className}` }>
            { props.children }
        </div>
    );
}

MainContentSection.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default MainContentSection;