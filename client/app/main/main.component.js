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

    this.isDisabled    = false;
    this.noCache    = true;
    this.selectedItem    = null;
    this.searchText = null;
    this.simulateQuery = false;

    this.states        = null;
  }

  $onInit() {
    var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
               Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
               Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
               Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
               North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
               South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
               Wisconsin, Wyoming';

    this.states = allStates.split(/, +/g).map( function (state) {
      return {
        value: state.toLowerCase(),
          display: state
        };
      });

    this.$http.get('/api/products')
      .then(response => {
        this.products = response.data;
        if (this.products.length < this.numberOfDisplay) {
          this.noMoreData = true;
        }
        this.busy = false;
      });
  }

  search(value) {
    console.log("value:" + value);
  }

  querySearch (query) {
    console.log("query:" + query);
    return this.states;
  }

  searchTextChange(text) {
    console.log('Text changed to ' + text);
  }

  selectedItemChange(item) {
    console.log('Item changed to ' + JSON.stringify(item));
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

  select(productId, rawdataUrl, maskeddataUrl) {
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
        maskeddataUrl: function() { return maskeddataUrl },
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
