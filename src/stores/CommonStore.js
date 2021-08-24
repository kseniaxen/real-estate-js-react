import { createSlice } from '@reduxjs/toolkit'

const CommonStore = createSlice({
    name:"CommonStore",
    initialState:{
        loading:false,
        error:'',
        basename:'http://127.0.0.1:8000/api',
        authBasename:'http://127.0.0.1:8000/api/auth'
    },
    reducers:{
        setLoading:(state, action) => {
            state.loading = action.payload
        },
        setError:(state, action) => {
            state.error = action.payload
        },
        clearError:(state, action) => {
            state.error = ''
        }
    }
})

export const {setLoading, setError, clearError} = CommonStore.actions
export default CommonStore.reducer