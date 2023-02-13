import { usingWithMemorize } from '../utils/reacting';

const usingCallback = usingWithMemorize((fn) => fn);

export default usingCallback;
