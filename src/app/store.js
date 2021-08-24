import {configureStore} from '@reduxjs/toolkit'
import CommonReducer from "../stores/CommonStore"
import RouterReducer from "../stores/RouterStore"
import UserReducer from "../stores/UserStore"

export default configureStore({
        reducer: {
            CommonStore:CommonReducer,
            RouterStore:RouterReducer,
            UserStore:UserReducer
        },middleware:(getDefaultMiddleware) => getDefaultMiddleware ({
            serializableCheck:false
        })
    }
)