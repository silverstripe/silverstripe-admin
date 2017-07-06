/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

import MiddlewareRegistry from '../MiddlewareRegistry';

describe('MiddlwareRegistry', () => {
  let registry = null;
  // eslint-disable-next-line no-unused-vars
  let service = null;
  beforeEach(() => {
    registry = new MiddlewareRegistry();
    service = (str) => str;
  });

  describe('add()', () => {
    it('throws on bad meta', () => {
      expect(() => registry.add({ before: {} }, () => {})).toThrow();
    });

    it('normalises context', () => {
      registry.add({ name: 'empty' }, () => {}, []);
      registry.add({ name: 'unknown' }, () => {});
      registry.add({ name: 'bar' }, () => {}, 'test');

      const empty = registry._middlewares.find(m => m.name === 'empty');
      expect(empty.context).toEqual(['__GLOBAL__']);

      const unknown = registry._middlewares.find(m => m.name === 'unknown');
      expect(unknown.context).toEqual(['__GLOBAL__']);

      const bar = registry._middlewares.find(m => m.name === 'bar');
      expect(bar.context).toEqual(['test']);
    });

    it('normalises priorities', () => {
      registry.add({ name: 'empty', before: [] }, () => {}, []);
      registry.add({ name: 'unknown' }, () => {});
      registry.add({ name: 'bar', before: 'foo' }, () => {}, 'test');

      const empty = registry._middlewares.find(m => m.name === 'empty');
      expect(empty.before).toEqual(['__TAIL__']);
      expect(empty.after).toEqual(['__HEAD__']);

      const unknown = registry._middlewares.find(m => m.name === 'unknown');
      expect(unknown.before).toEqual(['__TAIL__']);
      expect(unknown.after).toEqual(['__HEAD__']);

      const bar = registry._middlewares.find(m => m.name === 'bar');
      expect(bar.before).toEqual(['foo']);
    });
  });

  describe('sort()', () => {
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

      const middlewares = registry._middlewares.map(m => m.name);
      expect(middlewares).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    });

    it('resolves priorities', () => {
      const HOC_A = (original) => (str) => original(`A${str}`);
      const HOC_B = (original) => (str) => original(`B${str}`);
      const HOC_C = (original) => (str) => original(`C${str}`);

      // Ensure that ABC is applied in reverse (CBA), since the HOCs prepend
      registry.add({ name: 'middle', after: 'front', before: 'back' }, HOC_B);
      registry.add({ name: 'back', after: 'front' }, HOC_A);
      registry.add({ name: 'front', before: 'back' }, HOC_C);

      registry.sort();

      const matches = registry.getMatchesForContext();
      expect(matches[0].name).toBe('front');
      expect(matches[0].factory).toBe(HOC_C);
      expect(matches[1].name).toBe('middle');
      expect(matches[1].factory).toBe(HOC_B);
      expect(matches[2].name).toBe('back');
      expect(matches[2].factory).toBe(HOC_A);
    });
  });

  describe('getMatchesForContext()', () => {
    it('caches contexts', () => {
      const HOC1 = (original) => (str) => original(`${str}1`);
      registry.add({ name: '1', before: '*' }, HOC1, ['Universe']);
      const matches = registry.getMatchesForContext('Universe.World.Mathematics.Numbers');
      const matches2 = registry.getMatchesForContext('Universe.World.Mathematics.Numbers');
      const matches3 = registry.getMatchesForContext('Universe.World.Mathematics.Numbers');
      expect(matches2).toBe(matches);
      expect(matches3).toBe(matches);
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

    it('allows context', () => {
      const HOC1 = (original) => (str) => original(`${str}1`);
      const HOC2 = (original) => (str) => original(`${str}2`);
      const HOC3 = (original) => (str) => original(`${str}3`);
      const HOCA = (original) => (str) => original(`${str}A`);
      const HOCB = (original) => (str) => original(`${str}B`);
      const HOCC = (original) => (str) => original(`${str}C`);

      const numbers = { name: 'numbers' };
      registry.add(numbers, HOC1, ['Universe', 'World', 'Mathematics', 'Numbers']);
      registry.add(numbers, HOC2, ['Universe', 'World', 'Mathematics', '*']);
      registry.add(numbers, HOC2, ['Universe', '*', 'Mathematics']);
      registry.add(numbers, HOC3, ['Universe']);

      const letters = { name: 'letters', after: 'numbers' };
      registry.add(letters, HOCA, ['Universe', 'World', 'Language', 'Letters']);
      registry.add(letters, HOCB, ['Universe', 'World', 'Language', '*']);
      registry.add(letters, HOCB, ['*', 'World', 'Language', '*']);
      registry.add(letters, HOCC, ['*', 'World']);

      registry.sort();

      const numberMatches = registry.getMatchesForContext('Universe.World.Mathematics.Numbers');
      const letterMatches = registry.getMatchesForContext('Universe.World.Language.Letters');
      expect(numberMatches[0].factory).toBe(HOC1);
      expect(numberMatches[1].factory).toBe(HOC2);
      expect(numberMatches[2].factory).toBe(HOC2);
      expect(numberMatches[3].factory).toBe(HOC3);

      expect(letterMatches[0].factory).toBe(HOC3);
      expect(letterMatches[1].factory).toBe(HOCA);
      expect(letterMatches[2].factory).toBe(HOCB);
      expect(letterMatches[3].factory).toBe(HOCB);
      expect(letterMatches[4].factory).toBe(HOCC);
    });

    it('allows wildcards', () => {
      const HOC_RED = (original) => (title) => original(`${title}_RED`);
      const HOC_ORANGE = (original) => (title) => original(`${title}_ORANGE`);
      const HOC_YELLOW = (original) => (title) => original(`${title}_YELLOW`);
      const HOC_GREEN = (original) => (title) => original(`${title}_GREEN`);
      const HOC_BLUE = (original) => (title) => original(`${title}_BLUE`);
      const HOC_INDIGO = (original) => (title) => original(`${title}_INDIGO`);
      const HOC_VIOLET = (original) => (title) => original(`${title}_VIOLET`);

      registry.add({ name: 'violet', after: '*' }, HOC_VIOLET);

      const roy = { name: 'roy', before: '*' };
      registry.add(roy, HOC_RED);
      registry.add(roy, HOC_ORANGE);
      registry.add(roy, HOC_YELLOW);

      const gbi = { name: 'gbi', after: 'roy', before: 'violet' };
      registry.add(gbi, HOC_GREEN);
      registry.add(gbi, HOC_BLUE);
      registry.add(gbi, HOC_INDIGO);

      registry.sort();

      const matches = registry.getMatchesForContext();
      expect(matches[0].factory).toBe(HOC_RED);
      expect(matches[1].factory).toBe(HOC_ORANGE);
      expect(matches[2].factory).toBe(HOC_YELLOW);
      expect(matches[3].factory).toBe(HOC_GREEN);
      expect(matches[4].factory).toBe(HOC_BLUE);
      expect(matches[5].factory).toBe(HOC_INDIGO);
      expect(matches[6].factory).toBe(HOC_VIOLET);
    });
  });
});
