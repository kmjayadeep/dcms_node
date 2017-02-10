var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    expect = require('expect'),
    debug = require('debug')('test'),
    input = require('./testData'),
    constant = require('../constant'),
    config = require('../config')(),
    md5 = require('md5'),
    models = require('../models'),
    Promise = require('bluebird')

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
            });
        });
    });
    describe('Event Functions', () => {
        var id = 0;
        it('Puts an event', done => {
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
        it('Edits an event', done => {
            request(url)
                .post('/dcms-admin/event/' + id)
                .set('x-auth-token', input.token)
                .send(input.testEvent2)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.instanceof(Array);
                    done();
                });
        });
        it('Edits an event with wrong id gives error', done => {
            request(url)
                .post('/dcms-admin/event/' + id + '9384937')
                .set('x-auth-token', input.token)
                .send(input.testEvent2)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.instanceof(Array);
                    res.body[0].should.be.eql(0);
                    done();
                });
        });
        it('Gets event list', done => {
            request(url)
                .get('/dcms-admin/event')
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    done();
                });
        });
        it('Gets single event', done => {
            request(url)
                .get('/dcms-admin/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('admin');
                    done();
                });
        });
        it('Gets single event with wrong id gives error', done => {
            request(url)
                .get('/dcms-admin/event/' + id + '9384937')
                .set('x-auth-token', input.token)
                .expect(400)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.containEql(constant.cantfetchEvent);
                    done();
                });
        });
        it('Deletes an event', done => {
            request(url)
                .delete('/dcms-admin/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    done();
                });
        });
        it('Deleting an event with wrong id gives error', done => {
            request(url)
                .delete('/dcms-admin/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('deleted').be.eql(false);
                    done();
                });
        })

    });
    describe('Student Functions', () => {
        it('Gets Student list', done => {
            request(url)
                .get('/dcms-admin/student')
                .set('x-auth-token', input.token)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.instanceof(Array);
                    done();
                });
        });
        it('Gets student', ()=> {
            return models.student.create(input.testStudent1)
                .then((student) => {
                    return new Promise((resolve, reject) => {
                        request(url)
                            .get('/dcms-admin/student/' + student.id)
                            .set('x-auth-token', input.token)
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end((err, res) => {
                                should.not.exist(err)
                                res.body.should.have.property('name')
                                resolve(res)
                            })
                    })
                })
                .then(() => {
                    return models.student.destroy({
                        where: input.testStudent1
                    })
                })
        })
    })
});
