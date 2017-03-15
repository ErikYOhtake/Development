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
    this.tags = [];
    this.myPromise = null;
  }

  $onInit() {
    this.$http.get('/api/products/owner/')
      .then(response => {
        this.products = response.data;
      });
  }

  upload(file) {
    if(file) {
      this.myPromise =
      this.Upload.upload({
        url: '/api/products',
        method: 'POST',
        data: {
          file: file,
          'tags': this.tags.map(function(tag) {return tag.text;})
        }
      })
      .then(response => {
        this.products.push(response.data);
        this.file = null;
        this.tags = [];
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
    controller: MypageComponent
  })
  .name;
