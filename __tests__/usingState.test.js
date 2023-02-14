import reacting, { usingState } from '../src';

describe('usingState:', () => {
  it('initial state with value', () => {
    const running = reacting(() => {
      const [state] = usingState(0);

      return state;
    });

    const a = running();
    const b = running();

    expect(a).toBe(b);
    expect(a).toBe(0);
  });

  it('initial state with function', () => {
    let count = 0;

    const running = reacting(() => {
      const [state] = usingState(() => {
        count += 1;
        return 0;
      });

      return state;
    });

    const a = running();
    const b = running();

    expect(a).toBe(b);
    expect(a).toBe(0);
    expect(count).toBe(1);
  });

  it('change state', () => {
    const running = reacting(() => {
      const [state, setState] = usingState(0);

      setState(state + 1);
      return state;
    });

    const a = running();
    expect(a).toBe(0);
    const b = running();
    expect(b).toBe(1);
  });
});
