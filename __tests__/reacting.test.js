import reacting, { usingMemo, usingEffect } from '../src';

describe('reacting:', () => {
  it('combined usingMemo and usingEffect', () => {
    const array = [];

    const running = reacting((numberA = 0, numberB = 0) => {
      const sum = usingMemo(() => {
        return numberA + numberB;
      }, [numberA, numberB]);

      usingEffect(() => {
        array.push(sum);
      }, [sum]);
    });

    running(1, 2);
    running(1, 2);
    running(3, 4);
    running(1, 2);

    expect(array).toEqual([3, 7, 3]);
  });

  it('usingMemo when reacting under reacting', () => {
    const array = [];

    const add = reacting((numberA = 0, numberB = 0) => {
      return usingMemo(() => {
        const result = numberA + numberB;

        array.push(`S/${result}`);
        return result;
      }, [numberA, numberB]);
    });

    const multiply = reacting((numberA = 0, numberB = 0) => {
      return usingMemo(() => {
        const result = numberA * numberB;

        array.push(`P/${result}`);
        return result;
      }, [numberA, numberB]);
    });

    const running = reacting((numberA = 0, numberB = 0) => {
      const sum = add(numberA, numberB);
      const product = multiply(numberA, numberB);

      const result = usingMemo(() => {
        return sum + product;
      }, [sum, product]);

      return result;
    });

    const a = running(1, 2);
    const b = running(1, 2);

    expect(a).toBe(b);
    expect(a).toBe(5);
    expect(array).toEqual(['S/3', 'P/2']);
  });

  it('usingEffect for sync when reacting under reacting', () => {
    const array = [];

    const add = reacting((numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA + numberB;
        array.push(`S/${result}`);
      }, [numberA, numberB]);
    });

    const multiply = reacting((numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA * numberB;
        array.push(`P/${result}`);
      }, [numberA, numberB]);
    });

    const running = reacting((numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA + numberB;
        array.push(`${result}`);
      }, [numberA, numberB]);

      add(numberA, numberB);
      multiply(numberA, numberB);
    });

    running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3']);
    running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3']);
    running(3, 4);
    expect(array).toEqual(['S/3', 'P/2', '3', 'S/7', 'P/12', '7']);
    running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3', 'S/7', 'P/12', '7', 'S/3', 'P/2', '3']);
  });

  it('usingEffect for async when reacting under reacting', async () => {
    const array = [];

    const add = reacting(async (numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA + numberB;
        array.push(`S/${result}`);
      }, [numberA, numberB]);
    });

    const multiply = reacting(async (numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA * numberB;
        array.push(`P/${result}`);
      }, [numberA, numberB]);
    });

    const running = reacting(async (numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA + numberB;
        array.push(`${result}`);
      }, [numberA, numberB]);

      await add(numberA, numberB);
      await multiply(numberA, numberB);
    });

    await running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3']);
    await running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3']);
    await running(3, 4);
    expect(array).toEqual(['S/3', 'P/2', '3', 'S/7', 'P/12', '7']);
    await running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3', 'S/7', 'P/12', '7', 'S/3', 'P/2', '3']);
  });

  it('usingEffect for sync/async when reacting under reacting', async () => {
    const array = [];

    const add = reacting((numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA + numberB;
        array.push(`S/${result}`);
      }, [numberA, numberB]);
    });

    const multiply = reacting(async (numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA * numberB;
        array.push(`P/${result}`);
      }, [numberA, numberB]);
    });

    const running = reacting(async (numberA = 0, numberB = 0) => {
      usingEffect(() => {
        const result = numberA + numberB;
        array.push(`${result}`);
      }, [numberA, numberB]);

      add(numberA, numberB);
      await multiply(numberA, numberB);
    });

    await running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3']);
    await running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3']);
    await running(3, 4);
    expect(array).toEqual(['S/3', 'P/2', '3', 'S/7', 'P/12', '7']);
    await running(1, 2);
    expect(array).toEqual(['S/3', 'P/2', '3', 'S/7', 'P/12', '7', 'S/3', 'P/2', '3']);
  });
});
