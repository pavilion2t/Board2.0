import './breadcrumb.scss';

import React, { createElement, PropTypes } from 'react';

import { Link } from 'react-router';

function Breadcrumb(props) {
    let { links = [], className = '' } = props;
    return (
        <div className={ `breadcrumb ${className}` }>
            {
                links.reduce((els, item, i, ary) => {
                    let len = ary.length;
                    let className = `breadcrumb__link ${item.active ? 'breadcrumb__link--active' : ''}`;
                    let { link: to, label, onClick } = item;
                    let comp = to ? Link : 'span';
                    let key = els.length;
                    if (typeof onClick === 'function') {
                        els.push(
                            createElement('a', { className, key, href: '#', onClick: (event) => {
                                event.preventDefault();
                                onClick(event);
                            } }, label)
                        );
                    } else {
                        els.push(
                            createElement(comp, { className, to, key }, label)
                        );
                    }
                    els.push(
                        i < len - 1 ? <span className="breadcrumb__separator" key={ els.length }>&gt;</span> : null
                    );
                    return els;
                }, [])
            }
        </div>
    );
}

Breadcrumb.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string,
            active: PropTypes.bool,
            onClick: PropTypes.func,
        })
    ).isRequired,
    className: PropTypes.string,
};

export default Breadcrumb;
