import { createSlice } from '@reduxjs/toolkit'
import Home from "../components/pages/Home"
import Apartments from "../components/pages/Apartments"
import Houses from "../components/pages/Houses"
import User_N from "../components/pages/User"
import SignIn from "../components/pages/SignIn"
import SignUp from "../components/pages/SignUp"
import Dashboard from "../components/pages/admin/Dashboard";

export const anonymousRoutes = [
    { path: '/', name: 'Главная', Component: Home },
    { path: '/apartment', name: 'Квартиры', Component: Apartments },
    { path: '/house', name: 'Дома', Component: Houses },
    { path: '/signin', name: 'Войти', Component: SignIn },
    { path: '/signup', name: 'Регистрация', Component: SignUp }
]

export const loggedRoutes = [
    { path: '/', name: 'Главная', Component: Home },
    { path: '/apartment', name: 'Квартиры', Component: Apartments },
    { path: '/house', name: 'Дома', Component: Houses },
    { path: '/user', name: 'Пользователь', Component: User_N },
    { path: '/logout', name: 'Выйти', Component: Home }
]

export const adminRoutes = [
    { path: '/', name: 'Главная', Component: Home },
    { path: '/apartment', name: 'Квартиры', Component: Apartments },
    { path: '/house', name: 'Дома', Component: Houses },
    { path: '/admin', name: 'Панель управления', Component: Dashboard },
    { path: '/logout', name: 'Выйти', Component: Home }
]

const RouterStore = createSlice({
    name:'RouterStore',
    initialState:{
        routes: anonymousRoutes,
        navRoutes:anonymousRoutes
    },
    reducers:{
        setAnonymousRoutes:(state) =>{
            state.routes = anonymousRoutes
        },
        setLoggedRoutes:(state) =>{
            state.routes = loggedRoutes
        },
        setAdminRoutes:(state) =>{
            state.routes = adminRoutes
        }
    }
})

export const { setAnonymousRoutes, setLoggedRoutes, setAdminRoutes } = RouterStore.actions
export default RouterStore.reducer;