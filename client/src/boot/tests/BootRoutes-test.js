/* global jest, jasmine, describe, afterEach, it, expect, window */

jest.unmock('../BootRoutes.js');
jest.unmock('lib/Config');
jest.unmock('lib/Router');

import BootRoutes from '../BootRoutes';

describe('Bootroutes', () => {
  beforeEach(() => {
    // Set window config
    window.ss.config = {
      baseUrl: '/subdir',
      absoluteBaseUrl: 'http://www.mypage.com/subdir/',
      sections: [
        {
          name: 'MySection',
          url: 'admin/mysection',
          reactRouter: true,
        },
        {
          name: 'OldSection',
          url: 'admin/old-section',
        },
      ],
    };
  });

  describe('add', () => {
    it('loading react section should boot react', () => {
      const routes = new BootRoutes({});
      expect(routes.matchesReactRoute('/subdir/admin/old-section'))
        .toEqual(false);
      expect(routes.matchesReactRoute('/subdir/admin/old-section/subpage'))
        .toEqual(false);
      expect(routes.matchesReactRoute('/subdir/admin/mysection'))
        .toEqual(true);
      expect(routes.matchesReactRoute('/subdir/admin/mysection/subpage'))
        .toEqual(true);

      // It doesn't really matter what unknown sections are known as, as
      // either router will do a full page redirect to unknown routes.
      expect(routes.matchesReactRoute('/subdir/admin/anothersection'))
        .toEqual(false);
    });
  });
});
