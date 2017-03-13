'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './mypage.routes';

export class MypageComponent {
  /*@ngInject*/
  constructor($http, Upload) {
    this.$http = $http;
    this.Upload = Upload;
    this.file = null;
    this.products = [];
  }

  upload(file) {
    if(file) {
      this.Upload.upload({
        url: '/api/products',
        method: 'POST',
        file: file
      })
      .then(response => {
        this.products.push(response.data);
        this.file = null;
      })
      .catch(err => {
        console.log('error status:' + err);
      })
    }
  }
}

export default angular.module('aucshareApp.mypage', [uiRouter])
  .config(routes)
  .component('mypage', {
    template: require('./mypage.html'),
    controller: MypageComponent,
    controllerAs: 'mypageCtrl'
  })
  .name;
