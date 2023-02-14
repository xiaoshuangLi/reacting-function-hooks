import { isSameArray, isPromise } from './tools';

let masterFn;

let index = 0;
let effects = [];
const storeHooks = new WeakMap();

export const getHook = () => {
  const hooks = storeHooks.get(masterFn) || [];
  return hooks[index];
};

export const setHook = (hook) => {
  const hooks = storeHooks.get(masterFn) || [];

  hooks[index] = hook;
  storeHooks.set(masterFn, hooks);
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
  if (!masterFn) {
    throw new Error('You need wrap the function by reacting(() => { ... }).');
  }

  const result = hookFn(...args);

  index += 1;
  return result;
};

export const usingWithMemorize = (hookFn) => (fn, dependencies) => {
  if (!masterFn) {
    throw new Error('You need wrap the function by reacting(() => { ... }).');
  }

  const {
    memorizedState: prevMemorizedState,
    dependencies: prevDependencies,
  } = getHook() || {};

  const memorized = prevDependencies && isSameArray(prevDependencies, dependencies);
  const memorizedState = memorized ? prevMemorizedState : hookFn(fn);

  setHook({ memorizedState, dependencies });

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

    let result = fn.apply(this, args);
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
