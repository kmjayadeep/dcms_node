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
describe('Admin Functions', () => {
    describe('Login', () => {
        it('Logs in as admin', (done) => {
            request(url)
                .post('/dcms-admin/auth/login')
                .send({
                    idToken: input.token
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('name');
                    res.body.should.have.property('picture');
                    res.body.should.have.property('status');
                    done();
                });
        });
        it('No token gives error', done => {
            request(url)
                .post('/dcms-admin/auth/login')
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
                .post('/dcms-admin/auth/login')
                .set('x-auth-token', 'Bad Token')
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
