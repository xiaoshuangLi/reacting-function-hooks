import {
  using,
  getHook,
  setHook,
} from '../utils/reacting';

const getStateHook = (initialState) => {
  const hook = getHook();

  if (hook === undefined) {
    const memorizedState = typeof initialState === 'function'
      ? initialState()
      : initialState;

    setHook({ memorizedState });
  }

  return getHook();
};

const usingState = using((initialState) => {
  const hook = getStateHook(initialState) || {};
  const { memorizedState } = hook;

  const setState = (nextState) => {
    hook.memorizedState = typeof nextState === 'function'
      ? nextState(memorizedState)
      : nextState;
  };

  return [memorizedState, setState];
});

export default usingState;
