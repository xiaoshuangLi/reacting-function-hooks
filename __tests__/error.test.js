import reacting, {
  usingState,
  usingMemo,
  usingEffect,
} from '../src';

describe('error:', () => {
  it('without wrapping reacting', () => {
    const running = () => {
      usingMemo();
    };

    expect(running).toThrow('You need wrap the function by reacting(() => { ... })');
  });

  it('change the order of hooks', () => {
    const running = reacting(() => {
      const [count, setCount] = usingState(0);

      count % 2
        ? usingMemo(() => {})
        : usingEffect(() => {});

      setCount(count + 1);
    });

    running();
    expect(running).toThrow('We has detected a change in the order of Hooks called by function');
  });

  it('less for hooks', () => {
    const running = reacting(() => {
      const [count, setCount] = usingState(1);

      count % 2 && usingMemo(() => {});

      setCount(count + 1);
    });

    running();
    expect(running).toThrow('Runned less hooks than during the previous');
  });

  it('more for hooks', () => {
    const running = reacting(() => {
      const [count, setCount] = usingState(0);

      count % 2 && usingMemo(() => {});

      setCount(count + 1);
    });

    running();
    expect(running).toThrow('Runned more hooks than during the previous');
  });
});
