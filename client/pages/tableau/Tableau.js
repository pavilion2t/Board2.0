import React, {PropTypes} from 'react'
import {tableau} from '~/configs/config'
import './tableau.scss'

import Menu from './Menu'
import Report from './JSReport'

const tableauApi = `${tableau}/api/2.5`

let headers = new Headers()
headers.append('Accept', 'application/json')
headers.append('Content-Type', 'application/json')

async function apiRequest(path, options = {
  method: 'GET',
}) {
  options.headers = headers
  let response = await fetch(`${tableauApi}${path}`, options)
  if (response.ok){
    return await response.json()
  }
}

const credentials = {
  "credentials": {
    "name": "dashboard",
    "password": "bindorocks!!!",
    "site": {
      "contentUrl": ""
    }
  }
}

function seq(view) {
  let main = 999, sub = 999

  let found = view.match(/^(\d+)\.(\d+)/)
  if (found){
    main = parseInt(found[1])
    sub = parseInt(found[2])
  }
  return {
    main,
    sub
  }
}

class Tableau extends React.Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggleMenu = this.handleToggleMenu.bind(this)
    this.resize = this.resize.bind(this)
    this.state = {
      error: null,
      projects: [],
      view: null,
      width: null,
      menuWidth: null,
      height: null,
    }
  }
  async componentWillMount(){
    window.addEventListener("resize", this.resize)
    let workbooks, views
    try {
      let site = await this.signin()
      workbooks = await this.queryWorkbooks(site)
      views = await this.queryViews(site)
    } catch (e) {
      console.error(e);
      this.setState({error:e})
      return
    }

    let projects = {}
    let defaultView = null

    workbooks.map((workbook)=>{
      workbook.views = []
      for (let view of views){
        if (view.workbook.id === workbook.id){
          view.seq = seq(view.name)
          if (view.seq.main === 1 && view.seq.sub === 1)
            defaultView = view
          if (this.props.filter(view.seq))
            workbook.views.push(view)
        }
      }
      return workbook
    }).forEach(({id, project, views})=>{
      if (projects[project.id]){
        projects[project.id].views = projects[project.id].views.concat(views)
      } else if (views.length > 0){
        projects[project.id] = project
        project.views = views
      }
    })

    projects = Object.keys(projects).map(key=>{
      let project = projects[key]
      project.views = project.views.sort((a,b)=>a.seq.sub-b.seq.sub)
      let seqView = project.views.find(view=>view.seq.main < 999)
      project.seq = seqView?seqView.seq.main:999

      return project
    }).sort((a,b)=>a.seq-b.seq)
    this.setState({projects}, ()=>this.handleClick(defaultView))
  }
  componentWillUnmount(){
    window.removeEventListener("resize", this.resize)
  }
  async signin(){
    credentials.credentials.site.contentUrl = this.props.site
    let {credentials: info} =  await apiRequest(`/auth/signin`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    headers.set('X-Tableau-Auth', info.token)
    return info.site
  }
  async queryWorkbooks(site){
    let {workbooks} = await apiRequest(`/sites/${site.id}/workbooks`)
    return workbooks.workbook
  }
  async queryViews(site){
    let {views} = await apiRequest(`/sites/${site.id}/views`)
    return views.view
  }
  handleClick(view){
    this.setState({view})
  }
  handleToggleMenu(menuWidth){
    this.setState({menuWidth})
  }
  resize(){
    if (this.tableau){
      let {offsetWidth: width, offsetHeight: height} = this.tableau
      this.setState({width, height})
    }
  }
  render(){
    let {projects, error, view, ...dimensions} = this.state
    if (error){
      return <div>{error.message}</div>
    }
    return (
      <div className="tableau" ref={t=>this.tableau=t}>
        <Menu projects={projects} view={view} onClick={this.handleClick} onToggle={this.handleToggleMenu}/>
        <Report
          view={view}
          ref={report=>this.report=report}
          {...dimensions}
          site={this.props.site}
          storeIds={this.props.storeIds}
        />
      </div>
    )
  }
}

Tableau.propTypes= {
  filter: PropTypes.func,
  site: PropTypes.string,
  storeIds: PropTypes.string,
}

Tableau.defaultProps = {
  site: '',
  filter: ()=>true
}

export default Tableau
