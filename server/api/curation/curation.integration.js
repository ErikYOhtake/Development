'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCuration;

describe('Curation API:', function() {
  describe('GET /api/curations', function() {
    var curations;

    beforeEach(function(done) {
      request(app)
        .get('/api/curations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          curations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      curations.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/curations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/curations')
        .send({
          name: 'New Curation',
          info: 'This is the brand new curation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCuration = res.body;
          done();
        });
    });

    it('should respond with the newly created curation', function() {
      newCuration.name.should.equal('New Curation');
      newCuration.info.should.equal('This is the brand new curation!!!');
    });
  });

  describe('GET /api/curations/:id', function() {
    var curation;

    beforeEach(function(done) {
      request(app)
        .get(`/api/curations/${newCuration._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          curation = res.body;
          done();
        });
    });

    afterEach(function() {
      curation = {};
    });

    it('should respond with the requested curation', function() {
      curation.name.should.equal('New Curation');
      curation.info.should.equal('This is the brand new curation!!!');
    });
  });

  describe('PUT /api/curations/:id', function() {
    var updatedCuration;

    beforeEach(function(done) {
      request(app)
        .put(`/api/curations/${newCuration._id}`)
        .send({
          name: 'Updated Curation',
          info: 'This is the updated curation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCuration = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCuration = {};
    });

    it('should respond with the updated curation', function() {
      updatedCuration.name.should.equal('Updated Curation');
      updatedCuration.info.should.equal('This is the updated curation!!!');
    });

    it('should respond with the updated curation on a subsequent GET', function(done) {
      request(app)
        .get(`/api/curations/${newCuration._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let curation = res.body;

          curation.name.should.equal('Updated Curation');
          curation.info.should.equal('This is the updated curation!!!');

          done();
        });
    });
  });

  describe('PATCH /api/curations/:id', function() {
    var patchedCuration;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/curations/${newCuration._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Curation' },
          { op: 'replace', path: '/info', value: 'This is the patched curation!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCuration = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCuration = {};
    });

    it('should respond with the patched curation', function() {
      patchedCuration.name.should.equal('Patched Curation');
      patchedCuration.info.should.equal('This is the patched curation!!!');
    });
  });

  describe('DELETE /api/curations/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/curations/${newCuration._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when curation does not exist', function(done) {
      request(app)
        .delete(`/api/curations/${newCuration._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
