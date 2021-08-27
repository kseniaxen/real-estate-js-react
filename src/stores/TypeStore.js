import { createSlice } from '@reduxjs/toolkit'

const TypeStore = createSlice({
    name:'TypeStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        HTTP_STATUS_NO_CONTENT:204,
        types:[]
    },
    reducers:{
        setTypes:(state, action) => {
            state.types = action.payload
        }
    }
})

export const {setTypes} = TypeStore.actions
export default TypeStore.reducer