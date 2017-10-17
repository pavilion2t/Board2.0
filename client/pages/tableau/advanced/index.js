import React, {PropTypes} from 'react'
import Tableau from '../Tableau'

const AdvancedReport = ({params})=><Tableau storeIds={params.store_id} filter={(seq)=>seq.main !== 999 && seq.sub !== 999}/>

AdvancedReport.propTypes = {
  params: PropTypes.object.isRequired
}
export default AdvancedReport
