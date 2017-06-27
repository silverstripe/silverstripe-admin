import Injector from 'lib/Injector';
import { combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import ConfigReducer from 'state/config/ConfigReducer';
import SchemaReducer from 'state/schema/SchemaReducer';
import RecordsReducer from 'state/records/RecordsReducer';
import BreadcrumbsReducer from 'state/breadcrumbs/BreadcrumbsReducer';
import TreeDropdownFieldReducer from 'state/treeDropdownField/TreeDropdownFieldReducer';
import applyFormMiddleware from 'lib/dependency-injection/applyFormMiddleware';
import MobileMenuReducer from 'state/mobileMenu/MobileMenuReducer';
// import UnsavedFormsReducer from 'state/unsavedForms/UnsavedFormsReducer';

export default (extra = {}) => {
  const FormReducer = applyFormMiddleware(
    combineReducers({
      formState: ReduxFormReducer,
      formSchemas: SchemaReducer,
    })
  );

  Injector.reducer.registerMany({
    config: ConfigReducer,
    form: FormReducer,
    records: RecordsReducer,
    breadcrumbs: BreadcrumbsReducer,
    routing: routerReducer,
    treeDropdownField: TreeDropdownFieldReducer,
    mobileMenu: MobileMenuReducer,
    // @todo - Restore this once we address https://github.com/silverstripe/silverstripe-admin/issues/90
    // unsavedForms: UnsavedFormsReducer,
    ...extra,
  });
};
