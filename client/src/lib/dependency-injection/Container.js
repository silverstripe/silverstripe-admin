import buildInjectorContainer from './buildInjectorContainer';
import buildReactContainer from './buildReactContainer';
import buildReducerContainer from './buildReducerContainer';
import buildFormContainer from './buildFormContainer';

const Injector = buildInjectorContainer();
Injector.register('react', buildReactContainer());
Injector.register('reducer', buildReducerContainer());
Injector.register('form', buildFormContainer());

export default Injector;
