import React from 'react'
import cx from 'classnames'

class Menu extends React.Component {
  constructor(props){
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = {
      open: true
    }
  }
  handleToggle(){
    this.setState(({open})=>({open:!open}), ()=>this.props.onToggle(this.root.offsetWidth))
  }
  render(){
    let {projects, view, onClick} = this.props
    let {open} = this.state
    return (
      <div className={cx("menu-wrapper", {open})} ref={root=>this.root=root}>
        <div className="toggle" onClick={this.handleToggle}>
          <div className="child top"/>
          <div className="child bottom"/>
        </div>
        <div className="menu">
          {projects.map(project=>{
            return (
              <div className="menu-block" key={project.id}>
                <div className="menu-header">
                  {project.name}
                </div>
                {project.views.map((v)=>{
                  return (
                    <div
                      className={cx("menu-item", {active:v===view})}
                      onClick={()=>onClick(v)}
                      key={v.id}
                    >
                      {v.name}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

Menu.propTypes = {
  projects: React.PropTypes.array,
  view: React.PropTypes.object,
  onClick: React.PropTypes.func,
  onToggle: React.PropTypes.func,
}

export default Menu
