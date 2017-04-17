'use strict';

module.exports = PromiseifyAll;

/**
 * Batch conversion to promise.
 *
 * @param {string|function|object}  target
 * @param {null|object}             [ctx=null]
 * @param {boolean}                 [isCover=true]
 * @param {string|array}            [only=[]]
 * @returns {function|object}
 */
function PromiseifyAll (target, ctx=null, isCover=true, only=[]){
  if ('string' === typeof target){
    target = require(target);
  }

  if ('function' === typeof target){
    return Promiseify(target, ctx);
  }

  if ('string' === typeof only){
    only = only.split(' ');
  }

  if ('object' === typeof target){
    for (const key in target) {
      if (target.hasOwnProperty(key) && 'function' === typeof target[key]) {
        const nkey = isCover ? key : key + 'Sync';
        if (only.length > 0){
          if (only.includes(key)){
            target[nkey] = Promiseify(target[key], ctx);
          }
        }else{
          target[nkey] = Promiseify(target[key], ctx);
        }
      }
    }
    return target;
  }

  throw new TypeError('Incoming parameters of type doesn\'t support!');
}

PromiseifyAll.Promiseify = Promiseify;

/**
 * Will be with a callback function method of asynchronous method
 * converts promise.
 *
 * @param {function}    func
 * @param {null|object} [ctx=null]
 * @returns {Promise}
 */
function Promiseify(func, ctx=null){
  if('function' !== typeof func){
    throw new TypeError('The incoming parameter must be a function!');
  }
  return function(...args){
    ctx = ctx || this;
    return new Promise((resolve, reject)=>{
      const callback = function callback(err, ...args){
        if (err){
          return reject(err);
        }
        if (args.length > 0){
          resolve(args);
        }else{
          resolve();
        }
      };
      args.push(callback);
      func.apply(ctx, args);
    });
  };
}
