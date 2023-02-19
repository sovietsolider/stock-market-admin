import { createStore } from 'redux';
import stockReducer from "./stockSlice";
import {configureStore} from "@reduxjs/toolkit";

console.log("INITIALIZE STORE")
export default configureStore({
    reducer: {
        stock: stockReducer,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
        serializableCheck: false,
    }),
});



