import {
  using,
  getHook,
  setHook,
} from '../utils/reacting';

const getRefHook = (initialValue) => {
  const hook = getHook();

  if (hook === undefined) {
    const memorizedState = { current: initialValue };

    setHook({
      type: 'usingRef',
      memorizedState,
    });
  }

  return getHook();
};

const usingRef = using((initialValue) => {
  const hook = getRefHook(initialValue) || {};
  const { memorizedState } = hook;

  return memorizedState;
});

export default usingRef;
