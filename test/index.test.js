'use strict';

const assert = require('assert');
const promiseify = require('..');

describe('PromiseifyAll', ()=>{

  it('test node modules.', (done)=>{
    const fs = promiseify('fs');
    fs.stat(__filename).then((stat)=>{
      assert.equal(typeof stat, 'object');
      done()
    }).catch(done);
  });

  it('test conversion function.', (done)=>{
    const fnuc = function(a, b, cb){
      cb(null, a, b);
    };
    const funcSync = promiseify(fnuc);
    funcSync(1, 2).then((res)=>{
      assert.deepEqual(res, [1, 2]);
      done();
    }).catch(done);
  });

  it('test a method on an Object.', (done)=>{
    const Classes = {
      foo(a, b, cb){
        cb(null, a, b);
      }
    };
    const c = promiseify(Classes);
    c.foo(1, 2).then((res)=>{
      assert.deepEqual(res, [1, 2]);
      done();
    }).catch(done);
  });

  it('test object of the only function.', (done)=>{
    const Classes = {
      foo(a, b, cb){
        cb(null, a, b);
      },
      bar(a, cb){
        cb(null, a);
      },
      hello(cb){
        cb(null)
      }
    };
    const c = promiseify(Classes, Classes, true, 'bar hello');
    Promise.all([c.bar(1), c.hello()]).then(([bar, hello])=>{
      assert.deepEqual(bar, [1]);
      assert.equal(hello, undefined);
      done();
    }).catch(done);
  });

});
