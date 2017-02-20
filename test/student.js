var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    expect = require('expect'),
    debug = require('debug')('test'),
    models = require('../models'),
    input = require('./testData'),
    constant = require('../constant'),
    config = require('../config')(),
    md5 = require('md5');

var url = config.serverUrl;
var studentId = 0;
describe('Student Functions', () => {
    describe('Login', () => {
        it('Logs in as student', (done) => {
            request(url)
                .post('/student/login')
                // .set('x-auth-token', input.token)
                .send({
                    idToken: input.token
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('id');
                    studentId = res.body.id;
                    res.body.should.have.property('name').be.not.eql(null);
                    res.body.should.have.property('picture').be.not.eql(null);
                    done();
                });
        });
        it('No token gives error', done => {
            request(url)
                .post('/student/login')
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
                .post('/student/login')
                .set('x-auth-token', 'Bad Token')
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql(constant.wrongToken);
                    done();
                });
        });
        collegeId = "";
        it('Registers student', done => {
            models.college.create({
                name: "mycollege"
            }).then(result => {
                collegeId = result.id;
                input.registerStudent.collegeId = collegeId;
                request(url)
                    .post('/student/register')
                    .set('x-auth-token', input.token)
                    .send(input.registerStudent)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        should.not.exist(err);
                        done();
                    });
            }).catch(err => {
                should.not.exist(err);
            });
        });
        it('Errors on invalid register data', done => {
            input.registerStudent.collegeId = -1; //invalid Id
            request(url)
                .post('/student/register')
                .set('x-auth-token', input.token)
                .send(input.registerStudent)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql(constant.registerFailed);
                    done();
                });
        });
    });
    describe('Event Functions', () => {
        var id = 0;
        var groupId = 0;
        // create four users for testing
        models.student.create({
            id: 100000,
            uid: "100000"
        });
        models.student.create({
            id: 100001,
            uid: "100001"
        });
        models.student.create({
            id: 100002,
            uid: "100002"
        });
        models.student.create({
            id: 100003,
            uid: "100003"
        });

        it('Puts a single event for testing', done => {
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
                    res.body.should.have.property('group').be.eql(false);
                    id = res.body.id;
                    done();
                });
        });
        it('Puts a group event for testing', done => {
            request(url)
                .put('/dcms-admin/event')
                .set('x-auth-token', input.token)
                .send(input.testGroupEvent)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('id');
                    res.body.should.have.property('name').be.eql(input.testGroupEvent.name);
                    res.body.should.have.property('description').be.eql(input.testGroupEvent.description);
                    res.body.should.have.property('group').be.eql(true);
                    groupId = res.body.id;
                    done();
                });
        });
        it('Gets all events registered (no events)', done => {
            request(url)
                .get('/student/event/')
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql([]);
                    done();
                });
        });
        it('Gets if event is not registered', done => {
            request(url)
                .get('/student/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    done();
                });
        });
        it('Registers student to single event', done => {
            request(url)
                .put('/student/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql("success");
                    done();
                });
        });
        it('Gets all events registered (single event)', done => {
            request(url)
                .get('/student/event/')
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.not.be.an.Array;
                    res.body.should.have.size(1);
                    done();
                });
        });

        it('Errors on Registers student to group event without group attribute', done => {
            request(url)
                .put('/student/event/' + groupId)
                .set('x-auth-token', input.token)
                .expect(400)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.containEql(constant.noEventError);
                    done();
                });
        });
        it('Registers student to group event', done => {
            input.group.group.push(studentId);
            request(url)
                .put('/student/event/' + groupId)
                .set('x-auth-token', input.token)
                .send(input.group)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql("success");
                    done();
                });
        });
        it('Gets all events registered (group event)', done => {
            request(url)
                .get('/student/event/')
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.not.be.an.Array;
                    res.body.should.have.size(2);
                    done();
                });
        });
        it('Errors when register invalid event', done => {
            request(url)
                .put('/student/event/' + -1)
                .set('x-auth-token', input.token)
                .expect(400)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.containEql(constant.noEventError);
                    done();
                });
        });
        it('Gets if single event is registered', done => {
            request(url)
                .get('/student/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('isRegistered').be.eql(true);
                    done();
                });
        });
        it('Gets if group event is registered', done => {
            request(url)
                .get('/student/event/' + groupId)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.have.property('isRegistered').be.eql(true);
                    done();
                });
        });
        it('Gets empty if wrong event given to check', done => {
            request(url)
                .get('/student/event/' + -1)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.body.should.be.eql({});
                    done();
                });
        });
        it('Deletes event after test', done => {
            request(url)
                .delete('/dcms-admin/event/' + id)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    done();
                });
        });
        it('Deletes group event after test', done => {
            request(url)
                .delete('/dcms-admin/event/' + groupId)
                .set('x-auth-token', input.token)
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    done();
                });
        });
        models.student.destroy({
            where: {
                id: 100000
            }
        });
        models.student.destroy({
            where: {
                id: 100001
            }
        });
        models.student.destroy({
            where: {
                id: 100002
            }
        });
        models.student.destroy({
            where: {
                id: 100003
            }
        });

    });
});
