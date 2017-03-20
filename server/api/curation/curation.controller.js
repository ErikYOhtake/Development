/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/curations              ->  index
 * POST    /api/curations              ->  create
 * GET     /api/curations/:id          ->  show
 * PUT     /api/curations/:id          ->  upsert
 * PATCH   /api/curations/:id          ->  patch
 * DELETE  /api/curations/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Curation from './curation.model';

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

// Gets a list of Curations
export function index(req, res) {
  return Curation.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Curation from the DB
export function show(req, res) {
  return Curation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Curation in the DB
export function create(req, res) {
  // sleep
  const d1 = new Date();
  while (true) {
    const d2 = new Date();
    if(d2 - d1 > 3000) {
      break;
    }
  }

  // create a curation
  var curation = new Curation();
  curation.usid = req.body.userId;
  curation.prid = req.body.productId;

  return Curation.create(curation)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Curation in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Curation.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Curation in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Curation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Curation from the DB
export function destroy(req, res) {
  return Curation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
