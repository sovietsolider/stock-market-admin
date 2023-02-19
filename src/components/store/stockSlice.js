import { createSlice } from '@reduxjs/toolkit'

export const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        stock: [],
        prices: {},  //{{AAPL: 50}, "10/09/2022"}
        currentDate: ""
    },
    reducers: {
        setAll: (state, action) => {
            state.stock = action.payload;
        },
        setCurrentPrices: (state, action) => {
            state.prices = action.payload;
            console.log(action.payload);
        },
        emptyPrices: (state, action) => {
            state.prices={};
        },
        setCurrentDate: (state, action) => {
            state.currentDate = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { setAll } = stockSlice.actions

export default stockSlice.reducer