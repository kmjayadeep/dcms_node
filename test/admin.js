var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    expect = require('expect'),
    debug = require('debug')('test'),
    input = require('./testData'),
    constant = require('../constant'),
    config = require('../config')(),
    md5 = require('md5'),
    models = require('../models');

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
    describe('SuperAdmin', () => {
        it('SuperAdmin can change other admin status', done => {
            models.admin.update({
                status: 10
            }, {
                where: {
                    uid: constant.testProfile.uid
                }
            }).then(result => {
                // create test admin
                return models.admin.create(input.testAdmin1);
            }).then(result => {
                return new Promise((resolve, rej) => {
                    id = result.dataValues.id;
                    request(url)
                        .post('/dcms-admin/' + id)
                        .set('x-auth-token', input.token)
                        .send(input.testAdmin2)
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            should.not.exist(err);
                            if (err)
                                rej(err);
                            resolve();
                        });
                });
            }).then(() => {
                return models.admin.destroy({
                    where: input.testAdmin2
                });
            }).then(() => {
                done();
            }).catch(error => {
                //delete test admin if couldn't
                models.admin.destroy({
                    where: input.testAdmin1
                });
                should.not.exist(error);
                done();
            })
        })
    });
    
});
