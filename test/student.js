var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    expect = require('expect'),
    debug = require('debug')('test'),
    input = require('./testData'),
    constant = require('../constant'),
    config = require('../config')(),
    md5 = require('md5');

var url = config.serverUrl;
describe('Student Functions', () => {
    describe('Login', () => {
        it('Logs in as student', (done) => {
            request(url)
                .post("/user/login")
                // .set('x-auth-token', input.token)
                .send({
                    idToken: input.token
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('registered').be.eql(false);
                    res.body.should.have.property('name').be.not.eql(null);
                    res.body.should.have.property('picture').be.not.eql(null);
                    done();
                });
        });
        it('No token gives error', done => {
            request(url)
                .post("/user/login")
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql(constant.noAuthToken);
                    done();
                });
        });
        it('Bad token gives error', done => {
            request(url)
                .post("/user/login")
                .set('x-auth-token', "Bad Token")
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql(constant.wrongToken);
                    done();
                });
        });

    });
});
