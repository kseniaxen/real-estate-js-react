import { createSlice } from '@reduxjs/toolkit'

const CurrencyStore = createSlice({
    name:'CurrencyStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        HTTP_STATUS_NO_CONTENT:204,
        currencies:[],
        selectCurrency:null
    },
    reducers:{
        setCurrencies:(state, action) => {
            state.currencies = action.payload
        },
        setSelectCurrency:(state, action) => {
            state.selectCurrency = action.payload
        }
    }
})

export const {setCurrencies, setSelectCurrency} = CurrencyStore.actions
export default CurrencyStore.reducer