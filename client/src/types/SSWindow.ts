import * as JQuery from "jquery";
import { ConfigSection } from './ConfigSection';
import {ApolloClient} from "apollo-client";
import {Store} from "redux";


declare global {
    interface Window {
        ss: {
            config?: {
                sections: ConfigSection[],
                baseUrl?: string,
                absoluteBaseUrl?: string,
            },
            apolloClient?: ApolloClient<any>,
            store?: Store
        }
        jQuery(options: any): JQuery
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
        __REDUX_DEVTOOLS_EXTENSION__: any
        devToolsExtension: any
    }
}

window.ss = window.ss || {};