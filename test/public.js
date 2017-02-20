var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    expect = require('expect'),
    debug = require('debug')('test'),
    models = require('../models'),
    input = require('./testData'),
    constant = require('../constant'),
    config = require('../config')();

var url = config.serverUrl;
describe('Public Functions', () => {
    describe('Event Functions', () => {
        id = "";
        it('Admin puts an event for testing', done => {
            request(url)
                .put('/dcms-admin/event')
                .set('x-auth-token', input.token)
                .send(input.testEvent)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('id');
                    res.body.should.have.property('name').be.eql(input.testEvent.name);
                    res.body.should.have.property('description').be.eql(input.testEvent.description);
                    id = res.body.id;
                    done();
                });
        });
        it('Gives event list', (done) => {
            request(url)
                .get('/public/event')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.instanceof(Array);
                    done();
                });
        });
        it('Gives single event', done => {
            request(url)
                .get('/public/event/' + id)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    // res.body.should.have.property(constant.wrongToken);
                    done();
                });
        });
        it('Gives error on single event with wrong id', done => {
            request(url)
                .get('/public/event/' + "-1")
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.containEql(constant.cantfetchEvent);
                    done();
                });
        });
        it('Admin deletes an event', done => {
            request(url)
                .delete('/dcms-admin/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    done();
                });
        });

    });
});
