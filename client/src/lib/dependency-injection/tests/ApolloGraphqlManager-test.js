/* global jest, describe, beforeEach, it, pit, expect, process */

import ApolloGraphqlManager from '../ApolloGraphqlManager';
import { getFields } from '../graphql/helpers';

const createMock = (config = {}, templates = {}, fragments = {}) => (
  new ApolloGraphqlManager(config, templates, fragments)
);

describe('ApolloGraphqlManager', () => {
  it('Constructs', () => {
    const manager = createMock(
      { foo: 'bar' },
      { template1: 'template one' },
      { fragment1: 'fragment one' }
    );

    expect(manager.getConfig().foo).toBe('bar');
    expect(manager.templates.template1).toBe('template one');
    expect(manager.fragments.fragment1).toBe('fragment one');
    expect(manager.getConfig().availableFragments.fragment1).toBe('fragment one');
  });

  it('sets config', () => {
    const manager = createMock();
    manager.setConfig('foo', 'bar');

    expect(manager.getConfig().foo).toBe('bar');
    expect(() => manager.setConfig('fields', 'fail')).toThrow();
  });

  it('transforms apollo config', () => {
    const apolloConfig = {
      props(test) {
        return {
          propName: test
        };
      }
    };
    const manager = createMock({ apolloConfig });
    manager.transformApolloConfig('props', (test) => (prevProps) => ({
      ...prevProps,
      newPropName: `${test}--${test}`,
    }));

    const config = manager.getApolloConfig();
    expect(typeof config.props).toBe('function');
    expect(typeof config.props('cheese')).toBe('object');
    expect(config.props('cheese').propName).toBe('cheese');
    expect(config.props('cheese').newPropName).toBe('cheese--cheese');
  });

  it('adds params', () => {
    const manager = createMock();
    manager.addParam('test', 'String');
    manager.addParams({
      foo: 'Boolean',
      baz: 'Int!'
    });

    const params = manager.getConfig().params;
    expect(typeof params).toBe('object');
    expect(params.test).toBe('String');
    expect(params.foo).toBe('Boolean');
    expect(params.baz).toBe('Int!');
  });

  it('adds fields', () => {
    const manager = createMock();
    manager.addField('test');
    manager.addFields(['rest', 'fest']);

    const fields = manager.getConfig().fields;
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toContain('test');
    expect(fields).toContain('rest');
    expect(fields).toContain('fest');
  });

  it('adds nested fields', () => {
    const manager = createMock();
    manager.addFields(['FirstName', 'Surname']);
    manager.addFields(['Avatar', []]);
    manager.addField('URL', 'root/Avatar');

    const fields = manager.getConfig().fields;
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toContain('FirstName');
    expect(fields).toContain('Surname');
    expect(fields).toContain('Avatar');
    const i = fields.indexOf('Avatar') + 1;
    expect(Array.isArray(fields[i])).toBe(true);
    expect(fields[i]).toContain('URL');
    expect(() => manager.addFields('Foo', 'root/Surname')).toThrow();
  });

  it('adds args to fields', () => {
    const manager = createMock({ pagination: false });
    manager.addFields(['FirstName', 'Surname']);
    manager.addFields(['Avatar', []]);
    manager.addField('URL', 'root/Avatar');

    manager.addArg('Test', 'SomeVar', 'root/FirstName');
    manager.addArgs({
      Relative: 'SomeBool',
    }, 'root/Avatar/URL');
    // eslint-disable-next-line no-unused-expressions
    manager.setTemplate`query test { ${getFields} }`;

    const AST = manager.getGraphqlAST();

    expect(AST.kind).toBe('Document');
    const compiledQuery = AST.loc.source.body;
    expect(compiledQuery).toMatch(/FirstName\s*\(Test:\s*\$SomeVar\s*\)/);
    expect(compiledQuery).toMatch(/URL\s*\(Relative:\s*\$SomeBool\s*\)/);
  });

  it('uses fragments', () => {
    const manager = createMock();
    manager.useFragment('testFragment');

    const fragments = manager.getConfig().fragments;
    expect(Array.isArray(fragments)).toBe(true);
    expect(fragments).toContain('testFragment');
  });

  it('uses templates', () => {
    const manager = createMock({}, { template1: 'template one' });
    manager.useTemplate('template1');
    const template = manager.getConfig().templateName;
    expect(template).toBe('template1');

    expect(() => manager.useTemplate('fail')).toThrow();
  });

  it('uses temp fragments', () => {
    const manager = createMock();
    manager.addTempFragment('testFragment', 'this is a test fragment');
    const fragments = manager.getConfig().fragments;
    expect(Array.isArray(fragments)).toBe(true);
    expect(fragments).toContain('testFragment');
  });

  it('uses custom templates', () => {
    const manager = createMock();
    const is = 'is';
    // eslint-disable-next-line no-unused-expressions
    manager.setTemplate`this ${is} my template`;

    const template = manager.getConfig().templateName;
    expect(template).toBe('__TEMPLATE_OVERRIDE__');
    const templateObj = manager.templates[template];
    expect(templateObj.strings.length).toBe(2);
    expect(templateObj.strings).toContain('this ');
    expect(templateObj.strings).toContain(' my template');
    expect(templateObj.expressions.length).toBe(1);
    expect(templateObj.expressions[0]).toBe('is');
  });

  it('gets raw templates', () => {
    const is = 'is';
    const tag = (strings, ...expressions) => ({ strings, expressions });
    const template1 = tag`this ${is} my template`;
    const manager = createMock({}, { template1 });
    const raw = manager.getRawTemplate('template1');
    expect(raw.strings.length).toBe(2);
    expect(raw.strings).toContain('this ');
    expect(raw.strings).toContain(' my template');
    expect(raw.expressions.length).toBe(1);
    expect(raw.expressions[0]).toBe('is');
  });

  it('coallesces data', () => {
    const manager = createMock();
    ['options', 'props', 'variables', 'context', 'optimisticResponse'].forEach(key => {
      expect(manager.coallesceData(key, { fruit: 'apple', }, { dinosaur: 'dilophosaurus' }))
        .toEqual({ fruit: 'apple', dinosaur: 'dilophosaurus' });
    });
    expect(manager.coallesceData('refetchQueries', ['ankylosaurus'], ['velociraptor']))
      .toEqual(['ankylosaurus', 'velociraptor']);
    expect(manager.coallesceData('skip', true, false))
      .toBe(false);
    expect(manager.coallesceData('pollInterval', 2, 23))
      .toBe(23);
    expect(manager.coallesceData('pollInterval', 2, 'fail'))
      .toBe(2);
    expect(manager.coallesceData('fetchPolicy', { theOld: 'policy ' }, { theNew: 'policy' }))
      .toEqual({ theNew: 'policy' });
    expect(manager.coallesceData('fetchPolicy', { theOld: 'policy' }, 3))
      .toEqual({ theOld: 'policy' });
    expect(manager.coallesceData('name', 'old', 'new'))
      .toBe('new');
    expect(manager.coallesceData('fetchPolicy', 'old', true))
      .toBe('old');
    ['withRef', 'notifyOnNetworkStatusChange'].forEach(key => {
      expect(manager.coallesceData(key, 'old', 'new'))
        .toBe('new');
      expect(manager.coallesceData('fetchPolicy', 'old', false))
        .toBe('old');
    });
  });
});
