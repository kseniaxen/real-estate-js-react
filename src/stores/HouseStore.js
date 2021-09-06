import { createSlice } from '@reduxjs/toolkit'
import history from "../history";

const HouseStore = createSlice({
    name:'HouseStore',
    initialState:{
        HTTP_STATUS_OK:200,
        houses:[],
        count:null,
        start:1,
        end:4,
        typeFilter:null,
        countryFilter:null,
        cityFilter:null,
        currencyFilter:null,
        unitFilter:null,
        roomsFilter:null,
        floorsTo:null,
        floorsFrom:null,
        areaTo:null,
        areaFrom:null,
        landAreaTo:null,
        landAreaFrom:null,
        priceTo:null,
        priceFrom:null
    },
    reducers:{
        setHouses:(state, action) => {
            state.houses = action.payload
        },
        setCountHouse:(state, action) => {
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
        setUnitFilter:(state, action) => {
            state.unitFilter = action.payload
        },
        setRoomsFilter:(state, action) => {
            state.roomsFilter = action.payload
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
        setLandAreaToFilter:(state, action) => {
            state.landAreaTo = action.payload
        },
        setLandAreaFromFilter:(state, action) => {
            state.landAreaFrom = action.payload
        },
        setPriceFromFilter:(state, action) => {
            state.priceFrom = action.payload
        },
        setPriceToFilter:(state, action) => {
            state.priceTo = action.payload
        },
        historyPush:(state) => {
            history.push({
                pathname: '/house',
                search: `?${(state.typeFilter) ? 'typeId=' + state.typeFilter + '&' : ''}
                      ${(state.countryFilter) ? 'countryId=' + state.countryFilter + '&': ''}
                      ${(state.cityFilter) ? 'cityId=' + state.cityFilter + '&': ''}
                      ${(state.currencyFilter) ? 'currencyId=' + state.currencyFilter + '&': ''}
                      ${(state.unitFilter) ? 'unitId=' + state.unitFilter + '&': ''}
                      ${(state.roomsFilter) ? 'rooms=' + state.roomsFilter + '&': ''}
                      ${(state.floorsTo) ? 'floorsTo=' + state.floorsTo + '&': ''}
                      ${(state.floorsFrom) ? 'floorsFrom=' + state.floorsFrom + '&': ''}
                      ${(state.areaFrom) ? 'areaFrom=' + state.areaFrom + '&': ''}
                      ${(state.areaTo) ? 'areaTo=' + state.areaTo + '&': ''}
                      ${(state.landAreaFrom) ? 'landFrom=' + state.landAreaFrom + '&': ''}
                      ${(state.landAreaTo) ? 'landTo=' + state.landAreaTo + '&': ''}
                      ${(state.priceFrom) ? 'priceFrom=' + state.priceFrom + '&': ''}
                      ${(state.priceTo) ? 'priceTo=' + state.priceTo + '&': ''}
                      `
                    .replace(/\s/g, '')
            })
        }
    }
})

export const {setHouses,
    setCountHouse,
    setStart,
    setEnd,
    setTypeFilter,
    setCountryFilter,
    setCityFilter,
    setCurrencyFilter,
    setRoomsFilter,
    setFloorsToFilter,
    setFloorsFromFilter,
    setAreaFromFilter,
    setAreaToFilter,
    setLandAreaFromFilter,
    setLandAreaToFilter,
    setPriceFromFilter,
    setPriceToFilter,
    setUnitFilter,
    historyPush} = HouseStore.actions
export default HouseStore.reducer