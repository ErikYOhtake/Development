import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal, appConfig, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.numberOfDisplay = appConfig.numberOfDisplay;
    this.busy = true;
    this.noMoreData = false;
    this.userId = null;
    Auth.getCurrentUser()
    .then(data => {
      this.userId = data._id;
    });
    this.products = [];
  }

  $onInit() {
    this.$http.get('/api/products')
      .then(response => {
        this.products = response.data;
        if (this.products.length < this.numberOfDisplay) {
          this.noMoreData = true;
        }
        this.busy = false;
      });
  }

  showMore() {
    if(this.busy) {
      return;
    }
    this.busy = true;
    var lastId = this.products[this.products.length-1]._id;

    this.$http.get('/api/products/index/' + lastId)
      .then(response => {
        Array.prototype.push.apply(this.products, response.data);
        if (response.data.length === 0) {
          this.noMoreData = true;
        }
        this.busy = false;
      });
  }

  show(productId, rawdataUrl) {
    var productAddress = '0x40b23a65e265ec9a0c482ca195213323cfa8e0f6';
    //var sp = this.sharepoint.getPoint(productAddress)
    var sp = 10;
    var userId = this.userId;

    this.$uibModal.open({
      animation: true,
      controller: 'SelectController',
      controllerAs: 'selectCtrl',
      template: require('../select/select.html'),
      resolve:{
        userId: function() { return userId },
        productId: function() { return productId },
        rawdataUrl: function() { return rawdataUrl },
//        sp: function() { return sp.c }
        sp: function() { return sp }
      }
    });
  }
}

export default angular.module('aucshareApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
