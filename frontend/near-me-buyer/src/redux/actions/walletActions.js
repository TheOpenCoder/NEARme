import { walletConstants } from '../constants';
import { rapydServices } from '../../services';

export const walletActions = {
    getWalletDetails
};


function getWalletDetails(user) {

    return dispatch => {
        dispatch(request());

       return rapydServices.getCurrency(user.country_code)
         .then (
            countryDetails => {
                return rapydServices.retrieveWallet(user.wallet_id)
                .then(
                    res => {
                        let wallet = res.accounts.filter(item => {
                            return item.currency === countryDetails.currency_code;
                        });
                        dispatch(success({"currentWallet": wallet, wallet: res}));
        
                    },
                    error => {
                        console.log(error);
                        dispatch(failure());
                        return Promise.reject(error);
                    }
                )
            }
         )
           
    };

    function request() { return { type: walletConstants.GET_WALLET_REQUEST } }
    function success(walletDetails) { return { type: walletConstants.GET_WALLET_SUCCESS, walletDetails } }
    function failure() { return { type: walletConstants.GET_WALLET_FAILURE } }
}

