'use strict';

export default class SelectController {
  /*@ngInject*/
  constructor($http, $uibModalInstance, $scope, userId, productId, rawdataUrl, sp) {
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
    this.$scope = $scope;
    this.userId = userId;
    this.productId = productId;
    this.tags = null;
    this.rawdataUrl = rawdataUrl;
    this.sp = sp;
    this.comment = null;
  }

  $onInit() {
    this.$http.get('api/products/product/' + this.productId)
      .then(response => {
        this.tags = response.data.tags;
      });
  }

  buy() {
    this.$http.post('/api/trades', {
      userId: this.userId,
      productId: this.productId
      })
      .then(response => {
        console.log('BUY done');
      });
    this.$uibModalInstance.close();
  };

  cancel() {
    this.$uibModalInstance.close();
  };

  bad() {
    this.$http.post('/api/curations', {
      userId: this.userId,
      productId: this.productId
      })
      .then(response => {
        console.log('BAD done');
      });
    this.$uibModalInstance.close();
  };
}
