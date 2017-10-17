import add_customer from './add_customer'
import add_listings from './add_listings'
import add_material from './add_material'
import add_po from './add_po'
import header from './header'
import importer from './importer'
import inputs from './inputs'
import menu from './menu'
import message from './message'
import select_department from './select_department'
import select_discounts from './select_discounts'
import select_listings from './select_listings'
import select_workflow from './select_workflow'
import store_selection from './store_selection'
import tax_options from './tax_options'
import enclose_module from './enclose'
import fileread_module from './fileread'
import image_module from './image'
import ajax_paginator from './ajax_paginator'

export default angular
  .module('directive', [
    add_customer.name,
    ajax_paginator.name,
    add_listings.name,
    add_material.name,
    add_po.name,
    header.name,
    importer.name,
    inputs.name,
    menu.name,
    message.name,
    select_department.name,
    select_discounts.name,
    select_listings.name,
    select_workflow.name,
    store_selection.name,
    tax_options.name,
    enclose_module.name,
    fileread_module.name,
    image_module.name
  ])
