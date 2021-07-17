import { combineReducers } from 'redux';

import { auth } from './authReducers';
import { alert } from './alertReducer';
import { location } from './locationReducer';
import { delivery } from './deliveryReducer';

const rootReducer = combineReducers({
    auth,
    alert,
    location,
    delivery

});

export default rootReducer;