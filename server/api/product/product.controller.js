/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  upsert
 * PATCH   /api/products/:id          ->  patch
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Product from './product.model';
import cloudinary from 'cloudinary'; // TODO
import config from '../../config/environment';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Products
export function index(req, res) {
  return Product.find().sort({crtm: -1}).limit(config.numberOfDisplay).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function showMore(req, res) {
  return Product.find({_id: {$lt: req.params.pid}}).sort({crtm: -1}).limit(config.numberOfDisplay).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function findTags(req, res) {
  var query = req.params.query;
  return Product.find({tags: new RegExp(query, 'i')}, {_id: 0, 'tags.$': 1}).limit(5).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function findByOwner(req, res) {
  return Product.find({seid: req.user.id}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function findBySeller(req, res) {
  var query = {};
  query['seid'] = req.params.id;
  if (req.params.pid) {
    query['_id'] = {"$lt": req.params.pid};
  }
  return Product.find(query).sort({crtm: -1}).limit(config.numberOfDisplay).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function findByTag(req, res) {
  var query = {};
  query['tags'] = req.params.tag;
  if (req.params.pid) {
    query['_id'] = {"$lt": req.params.pid};
  }
  return Product.find(query).sort({crtm: -1}).limit(config.numberOfDisplay).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Product from the DB
export function show(req, res) {
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Product in the DB
export function create(req, res) {
  if(req.files.file) {
    // upload to CDN
    var file = req.files.file.path;
    cloudinary.uploader.upload(file, function(result) {console.log(result)})
      .then(result => {
        // register a Address
        // TODO

        // create url for index
        // TODO
        var murl =
          'http://res.cloudinary.com/dwbgracc3/image/upload/' +
          'c_pad,h_360,w_360/' + result.url.slice(49);

        // create a product
        var product = new Product();
        product.rurl = result.url;
        product.murl = murl;
        product.pbad = "dummy";
        product.prnm = req.product_name;
        product.expr = false;
        product.seid = req.user.id;
        product.sbad = "dummy";
        product.ctgy = ["親カテゴリ", "子カテゴリ"];
        product.tags = req.body.tags;

        Product.create(product)
          .then(respondWithResult(res, 201))
          .catch(handleError(res));
    });
  }
}

// Upserts the given Product in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Product in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Product from the DB
export function destroy(req, res) {
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
