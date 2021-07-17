import { combineReducers } from 'redux';

import { auth } from './authReducers';
import { alert } from './alertReducer';
import { location } from './locationReducer';
import { cart } from './cartReducer';
import { wishlist } from './wishlistReducer';
import { wallet } from './walletReducer';

const rootReducer = combineReducers({
    auth,
    alert,
    location,
    cart,
    wishlist,
    wallet

});

export default rootReducer;