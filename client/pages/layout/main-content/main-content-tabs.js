import './main-content-tabs.scss';

import React, { PropTypes } from 'react';

function MainContentTabs(props) {
    const { children = [], className = '' } = props;
    const { tabs = [], currentTab, onChange } = props;
    let childrenTabs = [].concat(children);

    // If tabs didn't pass by `children`, we can use `tabs`, `currentTab`, `onChange` shortcut
    if (childrenTabs.length === 0 && tabs.length > 0 && typeof onChange === 'function') {
        childrenTabs = tabs.filter(tab=>tab.show !== false).map((tab, i) => (
            <a href="#"
                key={ i }
                className={ `nav-link ${currentTab === tab.value ? 'active' : ''}` }
                onClick={ event => {
                    event.preventDefault();
                    onChange(tab.value);
                } }
            >{ tab.label }</a>
        ));
    }

    return childrenTabs.length > 0 ?
        (
            <div className={ `main-content-tab ${className}` }>
                <ul className="nav nav-tabs">
                    { childrenTabs.map((item, i) =>
                        <li key={ i } className="nav-item">{ item }</li>)
                    }
                </ul>
            </div>
        ) : null;
}

MainContentTabs.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            show: PropTypes.bool,
        })
    ),
    currentTab: PropTypes.string,
    onChange: PropTypes.func,
};

export default MainContentTabs;
