import reacting, { usingRef } from '../src';

describe('usingRef:', () => {
  it('memorized', () => {
    const running = reacting(() => {
      const object = usingRef();

      return object;
    });

    const a = running();
    const b = running();

    expect(a).toBe(b);
  });

  it('right structure when empty', () => {
    const running = reacting((current) => {
      const object = usingRef(current);

      return object;
    });

    const a = running();

    expect(a).toEqual({ current: undefined });
  });

  it('right structure when not empty', () => {
    const running = reacting((current) => {
      const object = usingRef(current);

      return object;
    });

    const a = running(1);

    expect(a).toEqual({ current: 1 });
  });

  it('use it well', () => {
    const running = reacting(() => {
      const object = usingRef(0);

      object.current += 1;

      return object;
    });

    const a = running();
    expect(a).toEqual({ current: 1 });
    running();
    expect(a).toEqual({ current: 2 });
    running();
    expect(a).toEqual({ current: 3 });
  });
});
