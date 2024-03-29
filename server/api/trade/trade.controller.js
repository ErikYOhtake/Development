/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/trades              ->  index
 * POST    /api/trades              ->  create
 * GET     /api/trades/:id          ->  show
 * PUT     /api/trades/:id          ->  upsert
 * PATCH   /api/trades/:id          ->  patch
 * DELETE  /api/trades/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Trade from './trade.model';

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

// Gets a list of Trades
export function index(req, res) {
  return Trade.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Trade from the DB
export function show(req, res) {
  return Trade.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Trade in the DB
export function create(req, res) {
  // sleep
  const d1 = new Date();
  while (true) {
    const d2 = new Date();
    if(d2 - d1 > 5000) {
      break;
    }
  }

  // create a trade
  var trade = new Trade();
  trade.buid = req.body.userId;
  trade.prid = req.body.productId;
  trade.sapr = 50;

  return Trade.create(trade)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Trade in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Trade.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Trade in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Trade.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Trade from the DB
export function destroy(req, res) {
  return Trade.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
