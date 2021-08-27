import { createSlice } from '@reduxjs/toolkit'

const CurrencyStore = createSlice({
    name:'CurrencyStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        HTTP_STATUS_NO_CONTENT:204,
        currencies:[]
    },
    reducers:{
        setCurrencies:(state, action) => {
            state.currencies = action.payload
        }
    }
})

export const {setCurrencies} = CurrencyStore.actions
export default CurrencyStore.reducer