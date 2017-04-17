promiseify-all
========
Batch conversion to promise.

Maintained by [@by11880](https://github.com/jiuhuan).

## Install
Node.js version recommended to use `>=6`.
```base
npm install promiseify-all
```

## Options
You can set the following parameter:
- @param {string|function|object}  `target`
- @param {null|object}             `[ctx=null]`
- @param {boolean}                 `[isCover=true]`
- @param {string|array}            `[only=[]]`
- @returns {function|object}

## Examples

Wrap entire Node modules recursively:
```javascript
const fs = require('promiseify-all')('fs');
fs.readFile('README.md').then((content)=>{
  console.log(content);
});
```

Wrap a single function:
```javascript
const promiseify = require('promiseify-all');

function foo(cb) {
  setTimeout(()=> cb(null, 1), 100);
}

const fooSync = promiseify(foo);
fooSync().then((res)=>{
  console.log(res === 1);
});
```

Wrap a method on an Object:
```javascript
const promiseify = require('promiseify-all');
const Classes = {
  foo(a, b, cb){
    cb(null, a, b);
  }
};

const c = promiseify(Classes, c);

c.foo(1, 2).then((res)=>{
  console.log(res);  // [1, 2]
});

```

Wrap a the methods specified:
```javascript
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
  console.log(bar);
  console.log(hello);
});
```

## Tests
Run the tests after installing dependencies with:
```base
npm run test
```

## License

[MIT](LICENSE)
