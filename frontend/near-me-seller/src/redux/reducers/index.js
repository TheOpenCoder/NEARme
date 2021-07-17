import { combineReducers } from 'redux';

import { auth } from './authReducers';
import { alert } from './alertReducer';
import { location } from './locationReducer';
import { product } from './productReducer';
import { orders } from './orderReducer';

const rootReducer = combineReducers({
    auth,
    alert,
    location,
    product,
    orders

});

export default rootReducer;