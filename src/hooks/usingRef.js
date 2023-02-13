import {
  using,
  getHook,
  setHook,
} from '../utils/reacting';

const getRefHook = (initialValue) => {
  const hook = getHook();

  if (hook === undefined) {
    const memorizedState = { current: initialValue };

    setHook({ memorizedState });
  }

  return getHook();
};

const usingState = using((initialValue) => {
  const hook = getRefHook(initialValue) || {};
  const { memorizedState } = hook;

  return memorizedState;
});

export default usingState;
