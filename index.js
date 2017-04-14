'use strict';

module.exports = PromiseifyAll;

/**
 * Batch conversion to promise.
 *
 * @param {string|function|object}  target
 * @param {null|object}             [ctx=null]
 * @param {boolean}                 [isCover=true]
 * @returns {function|object}
 */
function PromiseifyAll (target, ctx=null, isCover=true){
  if ('string' === typeof target){
    target = require(target);
  }

  if(!ctx){
    ctx = target;
  }

  if ('function' === typeof target){
    return Promiseify(target, ctx);
  }

  if ('object' === typeof target){
    for (const key in target) {
      if (target.hasOwnProperty(key) && 'function' === typeof target[key]) {
        const nkey = isCover ? key : key + 'Sync';
        target[nkey] = Promiseify(target[key], ctx);
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
    return new Promise((resolve, reject)=>{
      const callback = function callback(err, ...args){
        if (err){
          return reject(err);
        }
        resolve(args);
      };
      args.push(callback);
      func.apply(ctx, args);
    });
  };
}
