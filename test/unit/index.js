import 'isomorphic-fetch';
import 'fetch-mock';

import ServicesSpec from './services';
import StoreSpec from './store';
import ActionsSpec from './actions';
import ComponentSpec from './components';
import HelperSpec from './helpers';

export default function () {
    ServicesSpec();
    StoreSpec();
    ActionsSpec();
    ComponentSpec();
    HelperSpec();
}
