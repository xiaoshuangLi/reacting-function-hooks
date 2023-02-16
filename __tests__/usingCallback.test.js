import reacting, { usingCallback } from '../src';

describe('usingCallback:', () => {
  it('memorized when dependencies unchanged', () => {
    const running = reacting((...dependencies) => {
      const callback = usingCallback(
        (a, b) => a + b,
        dependencies,
      );

      return callback;
    });

    const a = running(1, 2, 3);
    const b = running(1, 2, 3);

    expect(a).toBe(b);
    expect(a(1, 2)).toBe(3);
  });

  it('memorized with enmpty dependencies', () => {
    const running = reacting(() => {
      const callback = usingCallback(
        (a, b) => a + b,
        [],
      );

      return callback;
    });

    const a = running();
    const b = running();

    expect(a).toBe(b);
    expect(a(1, 2)).toBe(3);
  });

  it('changed when dependencies changed', () => {
    const running = reacting((...dependencies) => {
      const callback = usingCallback(
        (a, b) => a + b,
        dependencies,
      );

      return callback;
    });

    const a = running(1, 2, 3);
    const b = running(1, 2);

    expect(a).not.toBe(b);
    expect(a(1, 2)).toBe(3);
  });

  it('changed everyting without dependencies', () => {
    const running = reacting(() => {
      const callback = usingCallback(
        (a, b) => a + b,
      );

      return callback;
    });

    const a = running();
    const b = running();

    expect(a).not.toBe(b);
    expect(a(1, 2)).toBe(3);
  });
});
