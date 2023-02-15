import { usingWithMemorize } from '../utils/reacting';

const usingCallback = usingWithMemorize(
  'usingCallback',
  (fn) => fn,
);

export default usingCallback;
