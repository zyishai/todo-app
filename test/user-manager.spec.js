import { expect } from 'chai';
import { mock } from 'sinon';
import { createHash } from 'crypto';

import { UserManager } from '../src/js/user-manager';

setup(function() {
    this.user = new UserManager();
});

test('calling login() without parameters should throw an error of "Missing username or password"', function() {
    expect(this.user.login).to.throw('Missing username or password');
});

test('calling login() with username and password should return hash of "username:password"', function() {
    const username = 'test',
        password = 'test',
        hash = createHash('sha1').update(`${username}:${password}`).digest('hex');
    
    expect(this.user.login({ username, password })).to.equal(hash);
});

test('calling login() without persist should clear the localstorage (and not save the hash)', function() {
    const localStorage = {
        removeItem: function() {}
    };
    const user = new UserManager(localStorage);
    const m = mock(localStorage).expects("removeItem").once().withArgs('todo-credentials');

    user.login({
        username: 'test',
        password: 'test'
    });

    m.verify();
});

test('calling login() with persist should save the hash in localstorage', function() {
    const localStorage = {
        setItem: function() {}
    }
    const user = new UserManager(localStorage);
    const mockedLocalStorage = mock(localStorage);
    mockedLocalStorage.expects('setItem').once().withArgs('todo-credentials');

    user.login({
        username: 'test',
        password: 'test',
        persist: true
    });

    mockedLocalStorage.verify();
});

test('calling login() and afterwards getUserToken() should return the calculated hash from the login() function', function() {
    const hash = this.user.login({
        username: 'test',
        password: 'test'
    });

    expect(this.user.getUserToken()).to.be.equal(hash);
});

test('calling getUserToken() without login() before, should return hash from localstorage (if exists)', function() {
    const localStorage = {
        getItem: function() {
            return JSON.stringify({
                token: 'hash'
            });
        }
    };
    const user = new UserManager(localStorage);

    expect(user.getUserToken()).equal(JSON.parse(localStorage.getItem('todo-credentials')).token);
});