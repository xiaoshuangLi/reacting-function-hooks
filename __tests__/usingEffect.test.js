import reacting, { usingEffect } from '../src';

describe('usingEffect:', () => {
  it('run only once when dependencies unchanged', () => {
    let count = 0;

    const running = reacting((...dependencies) => {
      usingEffect(() => {
        count += 1;
      }, dependencies);
    });

    running(1, 2, 3);
    running(1, 2, 3);

    expect(count).toBe(1);
  });

  it('run only once with enmpty dependencies', () => {
    let count = 0;

    const running = reacting(() => {
      usingEffect(() => {
        count += 1;
      }, []);
    });

    running();
    running();

    expect(count).toBe(1);
  });

  it('run when dependencies changed', () => {
    let count = 0;

    const running = reacting((...dependencies) => {
      usingEffect(() => {
        count += 1;
      }, dependencies);
    });

    running(1, 2, 3);
    running(1, 2);

    expect(count).toBe(2);
  });

  it('changed everyting without dependencies', () => {
    let count = 0;

    const running = reacting(() => {
      usingEffect(() => {
        count += 1;
      });
    });

    running();
    running();

    expect(count).toBe(2);
  });

  it('run after sync function end', () => {
    let string = '';

    const running = reacting((...dependencies) => {
      usingEffect(() => {
        string += 'b';
      }, dependencies);

      string += 'a';
    });

    running();

    expect(string).toBe('ab');
  });

  it('run after async function end', async () => {
    let string = '';

    const running = reacting(async (...dependencies) => {
      usingEffect(() => {
        string += 'b';
      }, dependencies);

      string += 'a';
      return string;
    });

    const promise = running();
    expect(string).toBe('a');

    const result = await promise;
    expect(result).toBe('a');
    expect(string).toBe('ab');
  });

  it('clean effect for sync function', () => {
    const array = [];

    const running = reacting((character) => {
      usingEffect(() => {
        array.push(character);
        return () => { array.push(`C/${character}`); };
      }, [character]);
    });

    running('1');
    expect(array).toEqual(['1']);

    running('2');
    expect(array).toEqual(['1', 'C/1', '2']);

    running('3');
    expect(array).toEqual(['1', 'C/1', '2', 'C/2', '3']);
  });

  it('clear effect for async function', async () => {
    const array = [];

    const running = reacting(async (character) => {
      usingEffect(() => {
        array.push(character);
        return () => { array.push(`C/${character}`); };
      }, [character]);
    });

    let promise = running('1');
    expect(array).toEqual([]);
    await promise;
    expect(array).toEqual(['1']);

    promise = running('2');
    expect(array).toEqual(['1']);
    await promise;
    expect(array).toEqual(['1', 'C/1', '2']);

    promise = running('3');
    expect(array).toEqual(['1', 'C/1', '2']);
    await promise;
    expect(array).toEqual(['1', 'C/1', '2', 'C/2', '3']);
  });
});
