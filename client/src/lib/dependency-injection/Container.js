import buildBaseContainer from './buildBaseContainer';
import buildInjectorContainer from './buildInjectorContainer';
import buildReactContainer from './buildReactContainer';
import buildReducerContainer from './buildReducerContainer';

const base = buildBaseContainer();

const Injector = buildInjectorContainer();
Injector.register('react', buildReactContainer(base));
Injector.register('reducer', buildReducerContainer(base));

export default Injector;
