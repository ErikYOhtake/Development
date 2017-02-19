'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('aucshareApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
