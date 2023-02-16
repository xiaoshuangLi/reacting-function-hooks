# reacting-function-hooks
Create react hooks for regular function.

```js
import reacting, {
  usingRef,
  usingMemo,
  usingState,
  usingEffect,
} from 'reacting-function-hooks';

const running = reacting(() => {
  console.log('\n\n<<<<<<<<<<<<<<<<<<< Function Begin');

  const ref = usingRef(0);
  const [count, setCount] = usingState(0);

  const memoCount = usingMemo(() => {
    return count;
  }, []);

  usingEffect(() => {
    console.log(`%c Effect: create by count: ${count}`, 'color: rgba(255, 0, 0, 1)');
    return () => console.log(`%c Effect: destory by count: ${count}`, 'color: rgba(255, 0, 0, .3)');
  }, [count]);

  ref.current += 1;
  setCount(count + 1);

  console.log(`%c Ref: ${JSON.stringify(ref)}`, 'color: blue');
  console.log(`%c Memo: count: ${memoCount}`, 'color: orange');
  console.log(`%c State: count: ${count}`, 'color: green');

  console.log('>>>>>>>>>>>>>>>>>>> Function End');
});

running();
running();
```
