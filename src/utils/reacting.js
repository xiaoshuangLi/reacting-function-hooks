import { isSameArray, isPromise } from './tools';

let masterFn;

let index = 0;
let effects = [];
const storeHooks = new WeakMap();

const getHooks = () => storeHooks.get(masterFn);

export const getHook = () => {
  const hooks = getHooks() || [];
  return hooks[index];
};

const checkForMasterFn = () => {
  if (!masterFn) {
    throw new Error('reacting-function-hooks: You need wrap the function by reacting(() => { ... }).');
  }
};

const checkHookForType = (nexthook) => {
  const prevHook = getHook();

  if (!prevHook || !nexthook) {
    return;
  }

  const { type: prevType } = prevHook;
  const { type: nextType } = nexthook;

  if (prevType !== nextType) {
    throw new Error(`reacting-function-hooks: We has detected a change in the order of Hooks called by function. This will lead to bugs and errors if not fixed.\n${prevType} ==> ${nextType}`);
  }
};

const checkFoHooksLength = (prevHooks) => {
  if (prevHooks === undefined) {
    return;
  }

  const { length } = prevHooks;

  if (length === index) {
    return;
  }

  const message = length < index
    ? 'reacting-function-hooks: Runned more hooks than during the previous.'
    : 'reacting-function-hooks: Runned less hooks than during the previous.';

  throw new Error(message);
};

export const setHook = (hook) => {
  checkHookForType(hook);

  const prevHooks = getHooks() || [];
  const nextHooks = prevHooks.slice();

  nextHooks[index] = hook;
  storeHooks.set(masterFn, nextHooks);
};

const runEffects = (currentEffects = effects) => {
  currentEffects.forEach(
    (effect) => effect && effect(),
  );
};

export const addEffect = (effectFn) => {
  effectFn && effects.push(effectFn);
};

export const using = (hookFn) => (...args) => {
  checkForMasterFn();

  const result = hookFn(...args);

  index += 1;
  return result;
};

export const usingWithMemorize = (type, hookFn) => (fn, dependencies) => {
  checkForMasterFn();

  const {
    memorizedState: prevMemorizedState,
    dependencies: prevDependencies,
  } = getHook() || {};

  const memorized = prevDependencies && isSameArray(prevDependencies, dependencies);
  const memorizedState = memorized ? prevMemorizedState : hookFn(fn);

  setHook({ type, memorizedState, dependencies });

  index += 1;
  return memorizedState;
};

export const reacting = (fn) => {
  return function reacted(...args) {
    const prevMasterFn = masterFn;
    const prevIndex = index;
    const prevEffects = effects;

    masterFn = fn;
    index = 0;
    effects = [];

    const prevHooks = getHooks();

    let result = fn.apply(this, args);
    checkFoHooksLength(prevHooks);

    const currentEffects = effects;

    if (isPromise(result)) {
      result = result.then((promised) => {
        runEffects(currentEffects);
        return promised;
      });
    } else {
      runEffects(currentEffects);
    }

    masterFn = prevMasterFn;
    index = prevIndex;
    effects = prevEffects;

    return result;
  };
};

export default reacting;
