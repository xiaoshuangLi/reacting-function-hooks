import reacting, { usingMemo } from '../src';

describe('usingMemo:', () => {
  it('memorized when dependencies unchanged', () => {
    let count = 0;

    const running = reacting((...dependencies) => {
      const object = usingMemo(() => {
        count += 1;
        return {};
      }, dependencies);

      return object;
    });

    const a = running(1, 2, 3);
    const b = running(1, 2, 3);

    expect(a).toBe(b);
    expect(count).toBe(1);
  });

  it('memorized with enmpty dependencies', () => {
    let count = 0;

    const running = reacting(() => {
      const object = usingMemo(() => {
        count += 1;
        return {};
      }, []);

      return object;
    });

    const a = running();
    const b = running();

    expect(a).toBe(b);
    expect(count).toBe(1);
  });

  it('changed when dependencies changed', () => {
    let count = 0;

    const running = reacting((...dependencies) => {
      const object = usingMemo(() => {
        count += 1;
        return {};
      }, dependencies);

      return object;
    });

    const a = running(1, 2, 3);
    const b = running(1, 2);

    expect(a).not.toBe(b);
    expect(count).toBe(2);
  });

  it('changed everyting without dependencies', () => {
    let count = 0;

    const running = reacting(() => {
      const object = usingMemo(() => {
        count += 1;
        return {};
      });

      return object;
    });

    const a = running();
    const b = running();

    expect(a).not.toBe(b);
    expect(count).toBe(2);
  });
});
