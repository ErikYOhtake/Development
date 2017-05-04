'use strict';

var express = require('express');
var controller = require('./product.controller');

var auth = require('../../auth/auth.service');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var router = express.Router();

router.get('/', controller.index);
router.get('/index/', controller.index);
router.get('/index/more/:pid', controller.showMore);
router.get('/find/:query', controller.findTags);
router.get('/owner/', auth.isAuthenticated(), controller.findByOwner);
router.get('/product/:id', controller.show);
router.get('/seller/:id', controller.findBySeller);
router.get('/seller/:id/more/:pid', controller.findBySeller);
router.get('/tag/:tag', controller.findByTag);
router.get('/tag/:tag/more/:pid', controller.findByTag);
router.post('/', auth.isAuthenticated(), multipartyMiddleware, controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
