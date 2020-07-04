import Injector from 'lib/Injector';
import { combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';
import ConfigReducer from 'state/config/ConfigReducer';
import SchemaReducer from 'state/schema/SchemaReducer';
import RecordsReducer from 'state/records/RecordsReducer';
import BreadcrumbsReducer from 'state/breadcrumbs/BreadcrumbsReducer';
import TreeDropdownFieldReducer from 'state/treeDropdownField/TreeDropdownFieldReducer';
import TabsReducer from 'state/tabs/TabsReducer';
import MobileMenuReducer from 'state/mobileMenu/MobileMenuReducer';
import UnsavedFormsReducer from 'state/unsavedForms/UnsavedFormsReducer';
import usedOnReducer from 'state/usedOn/usedOnReducer';
import applyFormMiddleware from 'lib/dependency-injection/applyFormMiddleware';
import ViewModeReducer from 'state/viewMode/ViewModeReducer';
import ToastsReducer from 'state/toasts/ToastsReducer';


export default (extra = {}) => {
  const FormReducer = combineReducers({
    formState: ReduxFormReducer,
    formSchemas: SchemaReducer,
  });

  Injector.reducer.registerMany({
    config: ConfigReducer,
    form: FormReducer,
    records: RecordsReducer,
    breadcrumbs: BreadcrumbsReducer,
    treeDropdownField: TreeDropdownFieldReducer,
    tabs: TabsReducer,
    mobileMenu: MobileMenuReducer,
    unsavedForms: UnsavedFormsReducer,
    usedOn: usedOnReducer,
    viewMode: ViewModeReducer,
    toasts: ToastsReducer,
    ...extra,
  });

  Injector.transform('admin', (updater) => {
    updater.reducer('form', applyFormMiddleware);
  });
};
