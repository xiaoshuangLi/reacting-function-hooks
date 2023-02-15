import { usingWithMemorize } from '../utils/reacting';

const usingMemo = usingWithMemorize(
  'usingMemo',
  (fn) => fn(),
);

export default usingMemo;
