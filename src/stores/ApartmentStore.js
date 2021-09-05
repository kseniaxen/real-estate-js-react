import { createSlice } from '@reduxjs/toolkit'

const ApartmentStore = createSlice({
    name:'ApartmentStore',
    initialState:{
        HTTP_STATUS_OK:200,
        apartments:[],
        count:null,
        start:1,
        end:4
    },
    reducers:{
        setApartments:(state, action) => {
            state.apartments = action.payload
        },
        setCountApartment:(state, action) => {
            state.count = action.payload
        },
        setStart:(state, action) => {
            state.start = action.payload
        },
        setEnd:(state, action) => {
            state.end = action.payload
        }
    }
})

export const {setApartments, setCountApartment, setStart, setEnd} = ApartmentStore.actions
export default ApartmentStore.reducer