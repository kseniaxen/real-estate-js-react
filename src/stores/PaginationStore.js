import { createSlice } from '@reduxjs/toolkit'

const PaginationStore = createSlice({
    name:'PaginationStore',
    initialState:{
        ITEMS_ON_PAGE:4,
        countPages:null,
        page:1,
        startPage:1,
        endPage:4
    },
    reducers:{
        setCountPages:(state, action) => {
            state.countPages = Math.ceil(action.payload / state.ITEMS_ON_PAGE)
        },
        setPage:(state, action) => {
            state.page = action.payload
        },
        setStartPage:(state, action) => {
            state.startPage = ((action.payload - 1) * state.ITEMS_ON_PAGE + 1)
        },
        setEndPage:(state,action) => {
            state.endPage = Math.min(state.page * state.ITEMS_ON_PAGE, action.payload)
        }
    }
})

export const { setCountPages, setPage, setStartPage, setEndPage} = PaginationStore.actions
export default PaginationStore.reducer;