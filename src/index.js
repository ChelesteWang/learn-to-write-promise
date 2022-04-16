/**
 * 确保每一个 then 返回中都有一个 Promise 对象
 */

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

/**
 * 确保每一个 Promise 都可以被 catch 捕获错误
 */

promiseObj.then(doSomething).catch((err) => {
  throw err;
});

/**
 * 避免在 then() 或 catch() 中直接调用 cb()
 */

function callback(err, data) {
  console.log("Callback got called with:", err, data);
  throw new Error("My error");
}

Promise.resolve()
  .then(() => callback(null, "data"))
  .catch((err) => callback(err.message, null));

// 执行结果
// Callback got called with: null data
// Callback got called with: My error null

// node.js 通过 setImmediate() 实现的异步执行
Promise.resolve()
  .then(() => setImmediate(() => callback(null, "data")))
  .catch((err) => setImmediate(() => callback(err.message, null)));

// node.js and 浏览器通过 setTimeout(cb,0) 实现的异步执行
Promise.resolve()
  .then(() => setTimeout(() => callback(null, "data"), 0))
  .catch((err) => setTimeout(() => callback(err.message, null), 0));

/**
 * 确保在 then() 或 catch() 中，我们总是返回或抛出一个原始值，而不是包装在 Promise 中。解决或 Promise.reject
 */

// false
myPromise.then(function (val) {
  return Promise.resolve(val * 2);
});
myPromise.then(function (val) {
  return Promise.reject("bad thing");
});

// true
myPromise.then(function (val) {
  return val * 2;
});
myPromise.then(function (val) {
  throw "bad thing";
});

/**
 * 不允许在 finally() 中使用返回语句
 */

// false
myPromise.finally(function (val) {
  console.log("value:", val);
});

// true
myPromise.finally(function (val) {
  return val;
});

/**
 * 不建议将 async 函数传递给 new Promise 的构造函数。
 */

// false
new Promise(async (_resolve, _reject) => {});

// true
new Promise((_resolve, _reject) => {});

/**
 * 不建议在循环里使用 await，有这种写法通常意味着程序没有充分利用 JavaScript 的事件驱动。
 */

// false
for (const url of urls) {
  const response = await fetch(url);
}

/**
 * 不建议将赋值操作和 await 组合使用，这可能会导致条件竞争。
 * */

// true
const responses = [];
for (const url of urls) {
  const response = fetch(url);
  responses.push(response);
}

await Promise.all(responses);

// false
let totalPosts = 0;

async function getPosts(userId) {
  const users = [
    { id: 1, posts: 5 },
    { id: 2, posts: 3 },
  ];
  await sleep(Math.random() * 1000);
  return users.find((user) => user.id === userId).posts;
}

async function addPosts(userId) {
  totalPosts += await getPosts(userId);
}

await Promise.all([addPosts(1), addPosts(2)]);
console.log("Post count:", totalPosts);

// true
let _totalPosts = 0;

async function getPosts(userId) {
  const users = [
    { id: 1, posts: 5 },
    { id: 2, posts: 3 },
  ];
  await sleep(Math.random() * 1000);
  return users.find((user) => user.id === userId).posts;
}

async function addPosts(userId) {
  const posts = await getPosts(userId);
  totalPosts += posts; // variable is read and immediately updated
}

await Promise.all([addPosts(1), addPosts(2)]);
console.log("Post count:", totalPosts);
