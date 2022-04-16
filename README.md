# learn-to-write-promise

Promise 规范实践

## 确保每一个 then 返回中都有一个 Promise 对象

```js
const promiseObj = new Promise((resolve, reject) => {
  resolve(1);
});

promiseObj.then((res) => {
  console.log(res);
  return res;
});

promiseObj.then(doSomething);

promiseObj.then(function (res) {
  if (res === 1) {
    return 2;
  } else {
    return 3;
  }
});
```

## 确保每一个 Promise 都可以被 catch 捕获错误

```js
promiseObj.then(doSomething).catch((err) => {
  throw err;
});
```

## 避免在 then() 或 catch() 中直接调用 cb()

```js
function callback(err, data) {
  console.log("Callback got called with:", err, data);
  throw new Error("My error");
}

Promise.resolve()
  .then(() => callback(null, "data"))
  .catch((err) => callback(err.message, null));
```

执行结果
Callback got called with: null data
Callback got called with: My error null

通过异步调用 callback() 来避免这种情况

```js
// node.js 通过 setImmediate() 实现的异步执行
Promise.resolve()
  .then(() => setImmediate(() => callback(null, "data")))
  .catch((err) => setImmediate(() => callback(err.message, null)));

// node.js and 浏览器通过 setTimeout(cb,0) 实现的异步执行
Promise.resolve()
  .then(() => setTimeout(() => callback(null, "data"), 0))
  .catch((err) => setTimeout(() => callback(err.message, null), 0));
```

## 确保在 then() 或 catch() 中，我们总是返回或抛出一个原始值，而不是包装在 Promise 中。解决或 Promise.reject

错误案例

```js
myPromise.then(function (val) {
  return Promise.resolve(val * 2);
});
myPromise.then(function (val) {
  return Promise.reject("bad thing");
});
```

正确案例

```js
myPromise.then(function (val) {
  return val * 2;
});
myPromise.then(function (val) {
  throw "bad thing";
});
```

## 不允许在 finally() 中使用返回语句

错误案例

```js
myPromise.finally(function (val) {
  return val;
});
```

正确案例

```js
myPromise.finally(function (val) {
  console.log("value:", val);
});
```
