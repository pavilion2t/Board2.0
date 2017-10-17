import directive from './directive'
import external_sources from './external_sources'
import factory from './factory'
import filter from './filter'
import grid from './grid'

export default angular
  .module('shared', [
    directive.name,
    external_sources.name,
    factory.name,
    filter.name,
    grid.name
  ])
