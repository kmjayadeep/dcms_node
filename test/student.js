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
});
