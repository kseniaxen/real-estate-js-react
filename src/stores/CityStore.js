import { createSlice } from '@reduxjs/toolkit'

const CityStore = createSlice({
    name:'CityStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        HTTP_STATUS_NO_CONTENT:204,
        cities:[],
        selectCountry:null
    },
    reducers:{
        setCities:(state, action) => {
            state.cities = action.payload
        },
        setSelectCountry:(state, action) => {
            state.selectCountry = action.payload
        }
    }
})

export const {setCities, setSelectCountry} = CityStore.actions
export default CityStore.reducer