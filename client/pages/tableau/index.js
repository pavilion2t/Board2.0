import Tableau from './Tableau'
import React, {PropTypes} from 'react'

const Report = ({params})=><Tableau storeIds={params.store_id}/>

Report.propTypes = {
  params: PropTypes.object.isRequired
}

export default Report
