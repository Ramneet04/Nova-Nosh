import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUser: null,
    error:null,
    loading:false,
    isVerifed:false,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart :(state)=>{
            state.loading = true;
            state.error = null;
        },
        signInSuccess:(state,action)=>{
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFail:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.address = null;
            state.error = null;
          },
          
        updateStart:(state)=>{
            state.loading = true;
            state.error = null;
        },
        updateSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        updateFail:(state,action) =>{
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart:(state)=>{
            state.loading = true;
            state.error = null;
        },

        deleteUserSuccess:(state)=>{
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        deleteUserFail:(state,action) =>{
            state.error = action.payload;
            state.loading = false;
        },
        clearError:(state)=>{
            state.error = null;
        }

    }
})

export const {signInStart,signInSuccess,signInFail,signOutSuccess,updateFail,updateSuccess,updateStart,deleteUserFail,deleteUserStart,deleteUserSuccess ,clearError} = userSlice.actions;

export default userSlice.reducer;

