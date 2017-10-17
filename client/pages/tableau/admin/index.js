import React, {PropTypes} from 'react'
import Tableau from '../Tableau'

const BindoAdmin = ({params})=><Tableau storeIds={params.store_id} site="BindoAdmin"/>

BindoAdmin.propTypes = {
  params: PropTypes.object.isRequired
}

export default BindoAdmin
