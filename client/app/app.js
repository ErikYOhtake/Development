'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';
import ngFileUpload from 'ng-file-upload';
import ngInfiniteScroll from 'ng-infinite-scroll';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';
import ngTagsInput from 'ng-tags-input';
import cgBusy from 'angular-busy';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import mypage from './mypage/mypage.component';
import select from './select';

import './app.css';

angular.module('aucshareApp', [ngCookies, ngResource, ngSanitize, ngFileUpload,
  ngInfiniteScroll, 'ngAnimate', 'ngMaterial', 'ngTagsInput', 'cgBusy', 'btford.socket-io', uiRouter,
  uiBootstrap, _Auth, account, admin, navbar, footer, main, constants, socket, util,
  mypage, select
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['aucshareApp'], {
      strictDi: true
    });
  });
