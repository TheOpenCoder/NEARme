import makeRapydRequest from "../helpers/raypdRequest";

export const rapydServices = {
    createCustomer,
    createEwallet,
    listOfficialDocuments,
    verifyIdentity,
    createCheckOutPage
};

function createCustomer(customerData) {
  
   return makeRapydRequest("POST", "/v1/customers", customerData)
    .then((res) => {
       return res.data.id;
    })
    .catch(err => {
        return Promise.reject(err.response);
    })

}


function createEwallet(ewalletData) {
  
    return makeRapydRequest("POST", "/v1/user", ewalletData)
     .then((res) => {
        return res.data.id;
     })
     .catch(err => {
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
        return Promise.reject(err.response);
    })


 }