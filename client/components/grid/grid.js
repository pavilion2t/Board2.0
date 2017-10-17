import React, { PropTypes } from 'react';

import GridBody from './gridBody';
import GridFooter from './gridFooter';

function Grid(props){
  const { bodyConfig, footerConfig, className = '', style } = props;
  const cl = `grid ${className}`;
  return (
    <div className={ cl } style={ style }>
      <GridBody { ...bodyConfig } />
      {
        !footerConfig ? null : <GridFooter { ...footerConfig } />
      }
    </div>
  );
}

Grid.propTypes = {
  bodyConfig:   PropTypes.object.isRequired,
  footerConfig: PropTypes.object,
  className:    PropTypes.string,
  style:        PropTypes.object,
};

export default Grid;
