import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCartStart:(state)=>{
            state.loading = true;
            state.error = null;
        },
        addToCartSuccess:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.cart = action.payload;
        },

        addToCartFail:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        removeFromCartStart:(state)=>{
            state.loading = true;
            state.error = null;
        },
        removeFromCartSuccess:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.cart = action.payload;
        },
        removeFromCartFail:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        increaseQuantityStart:(state)=>{
            state.loading = true;
            state.error = null;
        },
        increaseQuantitySuccess:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.cart = action.payload;
        },
        increaseQuantityFail:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        decreaseQuantityStart:(state)=>{
            state.loading = true;
            state.error = null;
        },
        decreaseQuantitySuccess:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.cart = action.payload;
        },
        decreaseQuantityFail:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        resetCart:(state)=>{
            state.loading = false;
            state.error = null;
            state.cart = [];
        }
    
    }
})

export const { addToCartStart, addToCartSuccess, addToCartFail, removeFromCartStart, removeFromCartSuccess,  removeFromCartFail, increaseQuantityStart, increaseQuantitySuccess, increaseQuantityFail, decreaseQuantityStart, decreaseQuantitySuccess, decreaseQuantityFail, resetCart } = cartSlice.actions;

export default cartSlice.reducer;