import { createSlice } from '@reduxjs/toolkit'

const UserStore = createSlice({
    name:'UserStore',
    initialState:{
        HTTP_STATUS_OK: 200,
        HTTP_STATUS_CREATE: 201,
        user:null,
        isLoginFlag:false
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
        }
    }
})

export const { setUser, reset, setIsLoginFlag } = UserStore.actions
export default UserStore.reducer;
