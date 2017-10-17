import React from 'react'
import auth from './auth'

class FrameReport extends React.Component {
  componentWillMount(){
    this.auth()
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.view!=this.props.view){
      this.auth()
    }
  }
  async auth(){
    let ticket = await auth()
    this.setState({ticket})
  }
  render(){
    let {view, storeId} = this.props
    let {ticket} = this.state
    if (!view || !ticket || ticket === -1){
      return null
    }
    let date = df(new Date(), 'yyyy-mm-dd')
    date = encodeURIComponent(date)
    let params = storeId.split(',').map((id, idx)=>`store_id_filter_${idx+1}=${id}`)
    params.push(`From=${date}`)
    params.push(`To=${date}`)
    return (
      <div className="container">
        <iframe
          src={`https://tableau.bindolabs.com/trusted/${ticket}/views/${view.contentUrl.replace('sheets/', '')}?:embed=yes&:toolbar=no&${params.join('&')}`}
        />
      </div>
    )
  }
}

export FrameReport
