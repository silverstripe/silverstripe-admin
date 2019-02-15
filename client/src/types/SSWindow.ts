import * as JQuery from "jquery";
import { ConfigSection } from './ConfigSection';
import {ApolloClient} from "apollo-client";
import {Store} from "redux";


declare global {
    interface Window {
        ss: {
            config?: {
                sections: ConfigSection[]
            },
            apolloClient?: ApolloClient<any>,
            store?: Store
        }
        jQuery(options: any): JQuery
    }
}

window.ss = window.ss || {};