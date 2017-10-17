import '../lang/translations';

import modules from './modules'
import shared from './shared'
import gettext from '../lang/translations'
import { config } from './index.config';
import { runBlock } from './index.run';
import { routerConfig } from './index.route';


angular
  .module('app', [
    'ngRoute',
    'ngCookies',
    'ngDialog',
    'ngMap',
    'ngSanitize',
    'ui.select',
    'ui.router',
    'ui.date',
    'ui.sortable',
    'ui.grid',
    'ui.grid.grouping',
    'ui.grid.resizeColumns',
    'ui.grid.exporter',
    'ui.grid.exporter.raw',
    'ui.utils.masks',
    'minicolors',
    shared.name,
    gettext,
    modules.name,
    'ui.grid.draggable-rows',
    'ui.grid.autoResize'
  ])
  //.factory('ReactWatch', ReactWatch)
  //.directive('ReactWatchDirective', ReactWatchDirective)
  .config(config)
  .config(routerConfig)
  .run(runBlock);

