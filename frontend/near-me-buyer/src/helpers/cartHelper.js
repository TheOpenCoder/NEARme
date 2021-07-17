import { useSelector } from 'react-redux';
import React from 'react';

export const cartHelper = {
    isProductAvailableInCart,
    HandleAddToCart,
    HandleRemoveProductFromCart,
    HandleQuantityChange
};


function isProductAvailableInCart(productId) {
    const cartItems = useSelector(state => state.cart.cartItems);
    var isInCart = false;

    for(const cartItem of cartItems){
        if(cartItem.product_id === productId){
            isInCart=true;
            break;
        }
    }

    return(isInCart)
}

function HandleAddToCart(product, cartItems) {
    cartItems.push(product);
    return cartItems;
}

function HandleRemoveProductFromCart(product, cartItems) {
    return cartItems.filter((cartItem) => cartItem.product_id !== product.product_id)
}

function HandleQuantityChange(product, cartItems, quantity) {
    const objIndex = cartItems.findIndex((cart => cart.product_id === product.product_id));
    cartItems[objIndex].quantity = quantity;
    return cartItems;
}
