import './main-content-header-buttons.scss';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Can from '../../../components/can/can';

function MainContentHeaderButtons(props) {
  const { className = '', config = []} = props;
  return (
    <div className={ className }>
      {
        config.filter(cfg => cfg.show !== false).map((cfg, i) => {
          const {content, className, btnType, permission, link, ...otherCfg} = cfg;
          const cl = className ? className : `btn btn-sm btn-${btnType || 'secondary'}`;
          const btn = link ?
            <Link key={ i } className={ cl } to={ link } {...otherCfg} >{ content }</Link> :
            <button key={ i } className={ cl } {...otherCfg} >{ content }</button>;
          let ret = btn;
          if (permission) {
            ret = <Can key={ i } action={ permission }>{ btn }</Can>;
          }
          return ret;
        })
      }
    </div>
  );
}

MainContentHeaderButtons.propTypes = {
  className: PropTypes.string,
  config: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node.isRequired,
      link: PropTypes.string,
      permission: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
      ]),
      show: PropTypes.bool,
      btnType: PropTypes.string,
      className: PropTypes.string,
      style: PropTypes.object,
      onClick: PropTypes.func,
    })
  ).isRequired,
};

export default MainContentHeaderButtons;
