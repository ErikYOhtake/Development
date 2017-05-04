import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  /*@ngInject*/
  constructor($http, $scope, $q, socket, $uibModal, appConfig, Auth) {
    this.$http = $http;
    this.$q = $q;
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

    this.users = null;
    this.tags = null;
    this.empty = [];

    this.getParam = '/api/products/index/';
  }

  $onInit() {
    this.$http.get(this.getParam)
      .then(response => {
        this.products = response.data;
        if (this.products.length < this.numberOfDisplay) {
          this.noMoreData = true;
        }
        this.busy = false;
      });
  }

  search(value) {
  }

  querySearch (query) {
    if (!query) {
      return this.empty;
    }
    this.users = null;
    this.tags = null;
    var promiseUser = this.findUsersByQuery(query);
    var promiseTags = this.findTagsByQuery(query);
    return this.$q.all([promiseUser, promiseTags])
      .then(() => {
        if (this.users && this.tags ) {
          return this.users.concat(this.tags);
        } else if (this.users) {
          return this.users;
        } else if (this.tags) {
          return this.tags;
        } else {
          return this.empty;
        }
      });
  }

  findUsersByQuery(query) {
    return this.$http.get('/api/users/find/' + query)
      .then(response => {
        var list;
        if (response.data.length > 0) {
          list = [response.data.length];
          for (var i = 0; i < response.data.length; i++) {
            list[i] = {
              state: response.data[i].name,
              id: response.data[i]._id
            };
          }
          this.users = list.map( function (state) {
            return {
                type: 'user',
                value: state.state,
                display: state.state,
                id: state.id
              };
            });
        };
      });
  }

  findTagsByQuery(query) {
    return this.$http.get('/api/products/find/' + query)
      .then(response => {
        var list;
        if (response.data.length > 0) {
          list = [response.data.length];
          for (var i = 0; i < response.data.length; i++) {
            list[i] = response.data[i].tags[0];
          }
          this.tags = list.map( function (state) {
            return {
                type: 'tag',
                value: state,
                display: state,
              };
            });
        };
      });
  }

  searchTextChange(text) {
  }

  selectedItemChange(item) {
    var type = item.type;
    if (type === 'user') {
      var id = item.id;
      this.getParam = '/api/products/seller/' + id;
    } else if (type === 'tag') {
      var value = item.value;
      this.getParam = '/api/products/tag/' + value;
    } else {
      // do nothing
    }
    return this.$http.get(this.getParam)
      .then(response => {
        this.noMoreData = false;
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

    var last = this.getParam.substr(this.getParam.length-1);
    this.$http.get(this.getParam + (last === '/' ? 'more/' : '/more/') + lastId)
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
