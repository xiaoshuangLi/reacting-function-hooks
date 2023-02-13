import { usingWithMemorize } from '../utils/reacting';

const usingMemo = usingWithMemorize((fn) => fn());

export default usingMemo;
