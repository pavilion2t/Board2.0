import React from 'react'
import auth from './auth'
import df from 'dateformat'

class Report extends React.Component{
  componentWillReceiveProps({view, width, height, menuWidth}){
    if (view === null)
      return

    let {props} = this
    if (view !== props.view){
      if (this.viz)
        this.viz.dispose()
      this.init(view)
    } else if (width !== props.width || height !== props.height || menuWidth !== props.menuWidth){
      this.viz.setFrameSize(width-menuWidth, height-this.toolbar.offsetHeight)
    }
  }
  async init(view) {
    if (view === null)
      return
    let {site} = this.props
    let ticket = await auth(site)
    let date = df(new Date(), 'yyyy-mm-dd')
    let params = this.props.storeIds.split(',').map((id, idx)=>`store_id_filter_${idx+1}=${id}`)
    params.push(`From=${date}`)
    params.push(`To=${date}`)
    let sitePath = site?`t/${site}/`:''
    let url = `https://tableau.bindolabs.com/trusted/${ticket}/${sitePath}views/${view.contentUrl.replace('sheets/', '')}?${params.join('&')}`
    let {offsetWidth, offsetHeight} = this.report
    let options = {
      width: offsetWidth,
      height: offsetHeight,
      hideTabs: true,
      hideToolbar: true,
    };
    this.viz = new window.tableau.Viz(this.report, url, options)
  }
  render(){
    return (
      <div className="report-container" ref={container=>this.container=container}>
        <div className="toolbar" ref={toolbar=>this.toolbar=toolbar}>
          <div className="btn" onClick={()=>this.viz.showExportCrossTabDialog()}>Download</div>
        </div>
        <div ref={report=>this.report=report} className="report"/>
      </div>
    )
  }
}

Report.propTypes = {
  view: React.PropTypes.object,
  storeIds: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  site: React.PropTypes.string.isRequired,
}

export default Report
