import {
  getHook,
  addEffect,
  usingWithMemorize,
} from '../utils/reacting';

const usingEffect = usingWithMemorize('usingEffect', (fn) => {
  const hook = getHook() || {};
  const { memorizedState = {} } = hook;

  memorizedState.creater = fn;

  addEffect(() => {
    const { creater, destory } = memorizedState;

    destory && destory();
    memorizedState.destory = creater();
  });

  return memorizedState;
});

export default usingEffect;
