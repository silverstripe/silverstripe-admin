import buildInjectorContainer from './buildInjectorContainer';
import buildComponentContainer from './buildComponentContainer';
import buildReducerContainer from './buildReducerContainer';
import buildFormContainer from './buildFormContainer';

const Injector = buildInjectorContainer();

Injector.register('component', buildComponentContainer());
Injector.register('reducer', buildReducerContainer());
Injector.register('form', buildFormContainer());

export default Injector;
