import makeRapydRequest from "../helpers/raypdRequest";

export const rapydServices = {
    createCustomer,
    createEwallet,
    listOfficialDocuments,
    verifyIdentity,
    createCheckOutPage,
    getCurrency,
    walletTransfer,
    retrieveWallet
};

function createCustomer(customerData) {
  
   return makeRapydRequest("POST", "/v1/customers", customerData)
    .then((res) => {
       return res.data.id;
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err.response);
    })

}


function createEwallet(ewalletData) {
  
    return makeRapydRequest("POST", "/v1/user", ewalletData)
     .then((res) => {
        return res.data.id;
     })
     .catch(err => {
        console.log(err);
         return Promise.reject(err.response);
     })
 
 }
 

 function listOfficialDocuments(countryCode) {
  
    return makeRapydRequest("GET", `/v1/identities/types?country=${countryCode}`)
     .then((res) => {
        return res.data;
     })
     .catch(err => {
         return Promise.reject(err.response);
     })
 
 }
 

 function verifyIdentity(creds) {

    return makeRapydRequest("POST", `/v1/identities`, creds)
     .then((res) => {
        return res.data;
     })
     .catch(err => {
         return Promise.reject(err);
     })
 
 }
 

 function createCheckOutPage(data) {

    return makeRapydRequest("POST", `/v1/checkout`, data)
    .then((res) => {
       return res.data;
    })
    .catch(err => {
        return Promise.reject(err.status.response_code);
    })


 }

 function getCurrency(countryCode) {

    return makeRapydRequest("GET", `/v1/data/countries`)
    .then((res) => {
       return res.data.find((country) => {
           if(country.iso_alpha2 === countryCode){
               return country;
           }
       })
    })
    .catch(err => {
        return Promise.reject(err.response);
    })

 }


 function walletTransfer(data) {

    return makeRapydRequest("POST", `/v1/account/transfer`, data)
    .then((res) => {
        return res.data;
     })
     .catch(err => {
         return Promise.reject(err.status.response_code);
     })
 }


 function retrieveWallet(ewallet) {

    return makeRapydRequest("GET", `/v1/user/${ewallet}`)
    .then((res) => {
        return res.data;
     })
     .catch(err => {
         return Promise.reject(err.status.response_code);
     })
 }