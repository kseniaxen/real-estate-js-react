import { createSlice } from '@reduxjs/toolkit'
import history from "../history";

const ApartmentStore = createSlice({
    name:'ApartmentStore',
    initialState:{
        HTTP_STATUS_OK:200,
        apartments:[],
        count:null,
        start:1,
        end:4,
        typeFilter:null,
        countryFilter:null,
        cityFilter:null,
        currencyFilter:null,
        roomsFilter:null,
        floorFrom:null,
        floorTo:null,
        floorsTo:null,
        floorsFrom:null,
        areaTo:null,
        areaFrom:null,
        priceTo:null,
        priceFrom:null
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
        },
        setTypeFilter:(state, action) => {
            state.typeFilter = action.payload
        },
        setCountryFilter:(state, action) => {
            state.countryFilter = action.payload
        },
        setCityFilter:(state, action) => {
            state.cityFilter = action.payload
        },
        setCurrencyFilter:(state, action) => {
            state.currencyFilter = action.payload
        },
        setRoomsFilter:(state, action) => {
            state.roomsFilter = action.payload
        },
        setFloorFromFilter:(state, action) => {
            state.floorFrom = action.payload
        },
        setFloorToFilter:(state, action) => {
            state.floorTo = action.payload
        },
        setFloorsFromFilter:(state, action) => {
            state.floorsFrom = action.payload
        },
        setFloorsToFilter:(state, action) => {
            state.floorsTo = action.payload
        },
        setAreaToFilter:(state, action) => {
            state.areaTo = action.payload
        },
        setAreaFromFilter:(state, action) => {
            state.areaFrom = action.payload
        },
        setPriceFromFilter:(state, action) => {
            state.priceFrom = action.payload
        },
        setPriceToFilter:(state, action) => {
            state.priceTo = action.payload
        },
        historyPush:(state) => {
            history.push({
                pathname: '/apartment',
                search: `?${(state.typeFilter) ? 'typeId=' + state.typeFilter + '&' : ''}
                      ${(state.countryFilter) ? 'countryId=' + state.countryFilter + '&': ''}
                      ${(state.cityFilter) ? 'cityId=' + state.cityFilter + '&': ''}
                      ${(state.currencyFilter) ? 'currencyId=' + state.currencyFilter + '&': ''}
                      ${(state.roomsFilter) ? 'rooms=' + state.roomsFilter + '&': ''}
                      ${(state.floorFrom) ? 'floorFrom=' + state.floorFrom + '&': ''}
                      ${(state.floorTo) ? 'floorTo=' + state.floorTo + '&': ''}
                      ${(state.floorsTo) ? 'floorsTo=' + state.floorsTo + '&': ''}
                      ${(state.floorsFrom) ? 'floorsFrom=' + state.floorsFrom + '&': ''}
                      ${(state.areaFrom) ? 'areaFrom=' + state.areaFrom + '&': ''}
                      ${(state.areaTo) ? 'areaTo=' + state.areaTo + '&': ''}
                      ${(state.priceFrom) ? 'priceFrom=' + state.priceFrom + '&': ''}
                      ${(state.priceTo) ? 'priceTo=' + state.priceTo + '&': ''}
                      `
                    .replace(/\s/g, '')
            })
        }
    }
})

export const {setApartments,
    setCountApartment,
    setStart,
    setEnd,
    setTypeFilter,
    setCountryFilter,
    setCityFilter,
    setCurrencyFilter,
    setRoomsFilter,
    setFloorToFilter,
    setFloorFromFilter,
    setFloorsToFilter,
    setFloorsFromFilter,
    setAreaFromFilter,
    setAreaToFilter,
    setPriceFromFilter,
    setPriceToFilter,
    historyPush} = ApartmentStore.actions
export default ApartmentStore.reducer