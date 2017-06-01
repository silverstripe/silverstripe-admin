/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

import MiddlewareRegistry from '../MiddlewareRegistry';


describe('MiddlwareRegistry', () => {
  let registry = null;

  beforeEach(() => {
    registry = new MiddlewareRegistry();
  });

  it('throws if no service is defined', () => {
    registry.add(
      { name: 'test' },
      () => {}
    );
    expect(() => registry.getFactory()).toThrow();
  });

  it('throws on bad meta', () => {
    expect(() => registry.add({ before: {} }, () => {})).toThrow();
  });

  it('normalises context', () => {
    registry.add({ name: 'empty' }, () => {}, []);
    registry.add({ name: 'undefined' }, () => {});
    registry.add({ name: 'string' }, () => {}, 'test');

    expect(registry._middlewares.find(m => m.name === 'empty').context).toBe('__GLOBAL__');
    expect(registry._middlewares.find(m => m.name === 'undefined').context).toBe('__GLOBAL__');
    expect(registry._middlewares.find(m => m.name === 'string').context).toEqual(['test']);
  });

  it('normalises priorities', () => {
    registry.add({ name: 'empty', before: [] }, () => {}, []);
    registry.add({ name: 'undefined' }, () => {});
    registry.add({ name: 'string', before: 'foo' }, () => {}, 'test');

    expect(registry._middlewares.find(m => m.name === 'empty').before).toEqual(['__TAIL__']);
    expect(registry._middlewares.find(m => m.name === 'empty').after).toEqual(['__HEAD__']);
    expect(registry._middlewares.find(m => m.name === 'undefined').before).toEqual(['__TAIL__']);
    expect(registry._middlewares.find(m => m.name === 'undefined').after).toEqual(['__HEAD__']);
    expect(registry._middlewares.find(m => m.name === 'string').before).toEqual(['foo']);
  });

  it('sorts priorities', () => {
    registry.add({ name: 'a', before: '*' }, () => {});
    registry.add({ name: 'h', after: '*' }, () => {});
    registry.add({ name: 'c', before: 'd' }, () => {});
    registry.add({ name: 'd', after: 'c' }, () => {});
    registry.add({ name: 'g', before: 'h' }, () => {});
    registry.add({ name: 'e', before: 'g', after: 'd' }, () => {});
    registry.add({ name: 'b', after: 'a', before: 'c' }, () => {});
    registry.add({ name: 'f', before: 'g' }, () => {});
    registry.sort();

    expect(registry._middlewares.map(m => m.name).join('')).toBe('abcdefgh');
  });

  it('matches contexts', () => {
    registry.add({ name: 'global' }, () => {});
    registry.add({ name: 'wellington' }, () => {}, ['Earth', 'Australasia', 'NZ', 'Wellington']);
    let matches = registry.getMatchesForContext('Earth.Australasia.NZ.Wellington');
    expect(matches.map(m => m.name)).toEqual(['global', 'wellington']);

    registry = new MiddlewareRegistry();
    registry.add({ name: 'continent' }, () => {}, ['Earth', 'Australasia']);
    registry.add({ name: 'oz' }, () => {}, ['Earth', 'Australasia', 'Australia']);
    matches = registry.getMatchesForContext('Earth.Australasia.NZ.Wellington');
    expect(matches.map(m => m.name)).toEqual(['continent']);

    registry.add({ name: 'country' }, () => {}, ['Earth', '*', 'NZ']);
    matches = registry.getMatchesForContext('Earth.Australasia.NZ.Wellington');
    expect(matches.map(m => m.name)).toEqual(['continent', 'country']);

    registry.add({ name: 'auckland' }, () => {}, ['Earth', 'Australasia', 'NZ', 'Auckland']);
    matches = registry.getMatchesForContext('Earth.Australasia.NZ');
    expect(matches.map(m => m.name)).toEqual(['continent', 'country']);

    matches = registry.getMatchesForContext('Earth.Australasia.NZ.Auckland.QueenStreet');
    expect(matches.map(m => m.name)).toEqual(['continent', 'country', 'auckland']);

    registry.add({ name: 'saturn' }, () => {}, ['Saturn', 'Europa']);
    registry.add({ name: 'europa' }, () => {}, ['*', 'Europa']);
    matches = registry.getMatchesForContext('Saturn.Europa.IceOcean');
    expect(matches.map(m => m.name)).toEqual(['saturn', 'europa']);
  });

  it('creates factories for contexts', () => {
    const service = (str) => str;
    registry.setService(service);

    const HOC1 = (original) => (str) => original(`${str}1`);
    const HOC2 = (original) => (str) => original(`${str}2`);
    const HOC3 = (original) => (str) => original(`${str}3`);
    const HOCA = (original) => (str) => original(`${str}A`);
    const HOCB = (original) => (str) => original(`${str}B`);
    const HOCC = (original) => (str) => original(`${str}C`);

    registry.add({ name: '1', before: '*' }, HOC1, ['Universe', '*', 'Mathematics']);
    registry.add({ name: '2', after: '1' }, HOC2, ['Universe', 'World', 'Mathematics']);
    registry.add({ name: '3', after: '*' }, HOC3, ['Universe', 'World', '*', 'Numbers']);

    registry.add({ name: 'A', before: '*' }, HOCA, ['Universe', '*', 'Language']);
    registry.add({ name: 'B', after: 'A' }, HOCB, ['Universe', 'World', 'Language']);
    registry.add({ name: 'C', after: '*' }, HOCC, ['Universe', 'World', '*', 'Letters']);

    registry.sort();

    const numberFactory = registry.getFactory('Universe.World.Mathematics.Numbers');
    const letterFactory = registry.getFactory('Universe.World.Language.Letters');

    expect(numberFactory('Numbers_')).toBe('Numbers_123');
    expect(letterFactory('Letters_')).toBe('Letters_ABC');
  });

  it('caches factories', () => {
    const service = (str) => str;
    registry.setService(service);
    spyOn(registry, 'getMatchesForContext').and.callThrough();

    const HOC1 = (original) => (str) => original(`${str}1`);
    registry.add({ name: '1', before: '*' }, HOC1, ['Universe']);
    registry.getFactory('Universe.World.Mathematics.Numbers');
    registry.getFactory('Universe.World.Language.Letters');
    registry.getFactory('Universe.World.Mathematics.Numbers');
    registry.getFactory('Universe.World.Mathematics.Numbers');

    expect(registry.getMatchesForContext.calls.count()).toBe(2);
  });
});
