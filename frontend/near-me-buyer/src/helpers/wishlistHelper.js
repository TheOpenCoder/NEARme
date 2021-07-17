import { useSelector } from 'react-redux';
import React from 'react';

export const wishlistHelper = {
    isProductAvailableInWishlist,
    HandleAddToWishlist,
    HandleRemoveProductFromWishlist
};


function isProductAvailableInWishlist(productId) {
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
    var isInWishlist = false;

    for(const wishlistItem of wishlistItems){
        if(wishlistItem.product_id === productId){
            isInWishlist=true;
            break;
        }
    }

    return(isInWishlist)
}

function HandleAddToWishlist(product, wishlistItems) {
    wishlistItems.push(product);
    return wishlistItems;
}

function HandleRemoveProductFromWishlist(product, wishlistItems) {
    return wishlistItems.filter((wishlistItem) => wishlistItem.product_id !== product.product_id)
}