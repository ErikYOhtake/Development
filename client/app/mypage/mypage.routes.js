'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('mypage', {
      url: '/mypage',
      template: '<mypage></mypage>',
      authenticate: true
    });
}
