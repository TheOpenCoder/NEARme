var axios = require('axios');
var CryptoJS = require("crypto-js");
import * as Random from 'expo-random';
import { RAPYD_BASE_URL, RAPYD_ACCESS_KEY, RAPYD_SECRET_KEY } from "@env";

export default async function makeRapydRequest(method, urlPath, body = null) {

    try {
        const salt = generateRandomString(8);
        const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString == "{}" ? "" : bodyString;
        }
        const signature = await sign(method, urlPath, salt, timestamp, bodyString);
       

        const options = {
            url: RAPYD_BASE_URL + urlPath,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                salt: salt,
                timestamp: timestamp,
                signature: signature,
                access_key: RAPYD_ACCESS_KEY
            },
            data: bodyString
        }
        return await rapydRequest(options);
    }
    catch (error) {
        console.error("Error generating request options");
        throw error;
    }
}

async function sign(method, urlPath, salt, timestamp, bodyString) {

    try {
        let toSign = method.toLowerCase() + urlPath + salt + timestamp + RAPYD_ACCESS_KEY + RAPYD_SECRET_KEY + bodyString;
        var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(toSign, RAPYD_SECRET_KEY));
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}



function generateRandomString(size) {

    try {
        return Random.getRandomBytes(size).toString('hex');
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}



async function rapydRequest(options) {

    return new Promise((resolve, reject) => {

        try {

            axios(options)
                .then(res => {
                    return resolve(res.data);
                })
                .catch(err => {
                    console.log("came to error");
                    console.log(err);
                    return reject(err.response.data);
                })
        }
        catch (err) {
            return reject(err);
        }
    })

}
