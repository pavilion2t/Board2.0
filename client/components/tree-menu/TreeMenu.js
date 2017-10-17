import React, { PropTypes } from 'react';
import cz from 'classnames';

function TreeNode(props){
  const { path, data = {}, onChange, toggleCollapse } = props;
  const { label, checkbox, checked, collapsed, children } = data;
  const hasChildren = (children||[]).length > 0;
  return (
    <div className="tree-view-node">
      <span
        className={ cz({
          'tree-view-node-collapse-toggle': true,
          'collapse-spacer': !hasChildren,
          'fa': hasChildren,
          'fa-chevron-down': hasChildren && !collapsed,
          'fa-chevron-right': hasChildren && collapsed,
        }) }
        onClick={ () => toggleCollapse(path, !collapsed) }
        ></span>
      <span>
        {
          !checkbox ? null :
            <input
              type="checkbox"
              className="tree-view-node-checkbox"
              checked={ !!checked }
              onChange={ (event) => onChange(path, event.target.checked) }
              />
        }
        <label className="tree-view-node-label">{ label }</label>
      </span>
      {
        !hasChildren ? null :
          <div
            className="tree-view-node-children"
            style={ { display: collapsed ? 'none' : 'block' } }
          >
            {
              children.map((d, i) => (
                <TreeNode
                  key={ `${path}.${i}` }
                  path={ `${path}.${i}` }
                  data={ d }
                  onChange={ onChange }
                  toggleCollapse={ toggleCollapse }
                  />
              ))
            }
          </div>
      }
    </div>
  );
}

TreeNode.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    checkbox: PropTypes.bool,
    checked: PropTypes.bool,
    collapsed: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
};

function TreeMenu(props){
  return (
    <div className="tree-view">
      {
        (props.data || []).map(
          (d, i) => (
            <TreeNode
              key={ `${i}` }
              path={ `${i}` }
              data={ d }
              onChange={ props.onChange }
              toggleCollapse={ props.toggleCollapse }
            />
          )
        )
      }
    </div>
  );
}

TreeMenu.propTypes = {
  data: PropTypes.arrayOf(TreeNode.propTypes.data).isRequired,
  onChange: PropTypes.func.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
};

export default TreeMenu;
