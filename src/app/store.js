import {configureStore} from '@reduxjs/toolkit'
import CommonReducer from "../stores/CommonStore"
import RouterReducer from "../stores/RouterStore"
import UserReducer from "../stores/UserStore"
import CountryReducer from "../stores/CountryStore"
import CityReducer from "../stores/CityStore"
import TypeReducer from "../stores/TypeStore"
import TypePropertyReducer from "../stores/TypePropertyStore"
import CurrencyReducer from "../stores/CurrencyStore"
import UnitReducer from "../stores/UnitStore"

export default configureStore({
        reducer: {
            CommonStore:CommonReducer,
            RouterStore:RouterReducer,
            UserStore:UserReducer,
            CountryStore:CountryReducer,
            CityStore:CityReducer,
            TypeStore:TypeReducer,
            TypePropertyStore:TypePropertyReducer,
            CurrencyStore:CurrencyReducer,
            UnitStore:UnitReducer
        },middleware:(getDefaultMiddleware) => getDefaultMiddleware ({
            serializableCheck:false
        })
    }
)