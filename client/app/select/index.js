'use strict';

import SelectController from './select.controller';

export default angular.module('aucshareApp.select', ['ui.router'])
  .controller('SelectController', SelectController)
  .name;
