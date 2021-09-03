import { createSlice } from '@reduxjs/toolkit'

const TypePropertyStore = createSlice({
    name:'TypePropertyStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        HTTP_STATUS_NO_CONTENT:204,
        typeproperties:[],
        selectTypeProperty:'Квартира'
    },
    reducers:{
        setTypeProperties:(state, action) => {
            state.typeproperties = action.payload
        },
        setSelectTypeProperty:(state, action) => {
            state.selectTypeProperty = action.payload
        }
    }
})

export const {setTypeProperties, setSelectTypeProperty} = TypePropertyStore.actions
export default TypePropertyStore.reducer