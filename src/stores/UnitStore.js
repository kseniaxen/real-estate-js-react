import { createSlice } from '@reduxjs/toolkit'

const UnitStore = createSlice({
    name:'UnitStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        HTTP_STATUS_NO_CONTENT:204,
        units:[],
        selectUnit:null
    },
    reducers:{
        setUnits:(state, action) => {
            state.units = action.payload
        },
        setSelectUnit:(state, action) => {
            state.selectUnit = action.payload
        }
    }
})

export const {setUnits, setSelectUnit} = UnitStore.actions
export default UnitStore.reducer