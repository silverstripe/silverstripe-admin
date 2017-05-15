import { provideInjector } from './dependency-injection/provideInjector';
import { withInjector } from './dependency-injection/withInjector';
import { get, register, freeze } from './dependency-injection/container';

export {
  provideInjector,
  withInjector,
};

export default {
  get,
  register,
  freeze,
}