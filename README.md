# reacting-function-hooks

Create React-like hooks for regular function.

At First, i just want ```usingMemo``` to optimize performace. But why say no to more hooks.

[Demo](https://codesandbox.io/s/reacting-function-hooks-zbdeeh)

## Installation

```sh
npm install --save react-baby-form
```

### Usage

```js
import reacting, {
  usingRef,
  usingMemo,
  usingState,
  usingEffect,
} from 'reacting-function-hooks';

const running = reacting(() => {
  const ref = usingRef(0);
  const [count, setCount] = usingState(0);

  const memoCount = usingMemo(() => {
    return count;
  }, []);

  usingEffect(() => {
    console.log('Do effect');
    return () => console.log('Clean effect');
  }, [count]);

  ref.current += 1;
  setCount(count + 1);
});

running();
running();
```

### API

#### reacting

For React, we have react-node to cache hooks for ```Function Component```. But we don't have it in regular function. So only thing we can do is use the function as a key to cache hooks.

```js
import reacting, { usingMemo } from 'reacting-function-hooks';

const running = reacting(() => {
  const memorizedObject = usingMemo(() => {
    return {};
  }, []);
  
  return memorizedObject;
});
```

#### usingRef

```usingRef``` returns a mutable ref object whose ```.current``` property is initialized to the passed argument ```(initialValue)```. The returned object will persist for everytime to run the function.

```js
import reacting, { usingRef } from 'reacting-function-hooks';

const running = reacting(() => {
  const memoizedValue = useMemo(
    () => computeExpensiveValue(a, b),
    [a, b],
  );

  return memoizedValue;
});
```

Maybe it can replace global variables for function.

```
let count = 0;

const runCounter = () => {
  count += 1;
  return count;
};
```
Replace to :

```js
import reacting, { usingRef } from 'reacting-function-hooks';

const runCounter = reacting(() => {
  const refCount = usingRef(0);
  
  refCount.current += 1;
  return refCount.current;
});
```

#### usingMemo

```usingMemo``` returns a memoized value.

Pass a “create” function and an array of dependencies. usingMemo will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on everytime.


```js
import reacting, { usingMemo } from 'reacting-function-hooks';

const running = reacting((a, b) => {
  const memoizedValue = useMemo(
    () => computeExpensiveValue(a, b),
    [a, b],
  );

  return memoizedValue;
});
```

#### usingState

```usingState``` returns a stateful value, and a function to update it.

During the initial execute, the returned state ```(state)``` is the same as the value passed as the first argument ```(initialState)```.

But not like ```React```, we cannot re-render or re-excute the function when ```setState```.So for me, the hook is not so useful.

```js
import reacting, { usingState } from 'reacting-function-hooks';

const running = reacting(() => {
  const [count, setCount] = usingState(0);
  
  setCount(count + 1);
  return count;
});
```

#### usingEffect

```usingEffect``` accepts a function that contains imperative, possibly effectful code. And pass a second argument to useEffect that is the array of values that the effect depends on.

Often, effects create resources that need to be cleaned up, such as a subscription or timer ID. To do this, the function passed to useEffect may return a clean-up function.

For sync function, the effect will fire just after executing the function. For async function the effect will fire just after resolving the promise.

```js
import reacting, { usingEffect } from 'reacting-function-hooks';

const running = reacting((a, b) => {
  usingEffect(() = {
    addToCache(a, b);
    return () => removeFromCache(a, b);
  }, [a, b]);
});
```

#### usingCallback

```usingCallback``` returns a memoized callback.

Pass an inline callback and an array of dependencies. ```usingCallback``` will return a memoized version of the callback that only changes if one of the dependencies has changed.


```js
import reacting, { usingEffect } from 'reacting-function-hooks';

const running = reacting((a, b) => {
  const memoizedCallback = useCallback(
    () => {
      doSomething(a, b);
    },
    [a, b],
  );
  
  return memoizedCallback;
});
```
