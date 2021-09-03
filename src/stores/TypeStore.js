import { createSlice } from '@reduxjs/toolkit'

const TypeStore = createSlice({
    name:'TypeStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        HTTP_STATUS_NO_CONTENT:204,
        types:[],
        selectType:null
    },
    reducers:{
        setTypes:(state, action) => {
            state.types = action.payload
        },
        setSelectType:(state, action) => {
            state.selectType = action.payload
        }
    }
})

export const {setTypes, setSelectType} = TypeStore.actions
export default TypeStore.reducer