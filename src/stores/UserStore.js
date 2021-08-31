import { createSlice } from '@reduxjs/toolkit'

const UserStore = createSlice({
    name:'UserStore',
    initialState:{
        HTTP_STATUS_OK: 200,
        HTTP_STATUS_CREATE: 201,
        user:null,
        isLoginFlag:false,
        apartments:[],
        houses:[],
        countApartments:null,
        countHouses:null
    },
    reducers:{
        setUser:(state, action) => {
            state.user = action.payload
        },
        reset:(state) => {
            state.user = null
        },
        setIsLoginFlag:(state, action) => {
            state.isLoginFlag = action.payload
        },
        setApartments:(state, action) => {
            state.apartments = action.payload
        },
        setHouses:(state, action) => {
            state.houses = action.payload
        },
        setCountApartments:(state, action) => {
            state.countApartments = action.payload
        },
        setCountHouses:(state, action) => {
            state.countHouses = action.payload
        }
    }
})

export const { setUser,
                reset,
                setIsLoginFlag,
                setApartments,
                setHouses,
                setCountApartments,
                setCountHouses} = UserStore.actions
export default UserStore.reducer;
