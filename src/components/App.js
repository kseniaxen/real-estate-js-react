import React, {useEffect} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {Router, Switch, Route} from 'react-router-dom'
import history from "../history";

import Navigation from "./common/Navigation";
import {CircularProgress,
        Container} from "@material-ui/core";
import {clearError, setError, setLoading} from "../stores/CommonStore";
import {setIsLoginFlag, setUser} from "../stores/UserStore";
import UserModel from "../models/UserModel";
import {setAdminRoutes, setAnonymousRoutes, setLoggedRoutes} from "../stores/RouterStore";
import {createTheme, ThemeProvider} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

const theme = createTheme({
    palette: {
        primary: blue,
    },
});

function App() {
    const routerStore = useSelector(state => state.RouterStore)
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const dispatch = useDispatch()

    useEffect(() => {
        const checkUserAuth = () => {
            dispatch(clearError())
            dispatch(setLoading(true))
            fetch(`${commonStore.authBasename}/user`, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response) {
                    if (response.status === 'success') {
                        if(response.data){
                            dispatch(setUser(new UserModel(response.data.id, response.data.name, response.data.email, response.data.role_name)))
                        }else {
                            dispatch(setIsLoginFlag(false))
                        }
                    }else if(response.status === 'failure'){
                        dispatch(setIsLoginFlag(false))
                        dispatch(setError(response.message))
                    }
                    dispatch(setLoading(false))
                }
            }).catch((error) => {
                dispatch(setIsLoginFlag(false))
                dispatch(setLoading(false))
                dispatch(setError(error.message))
                throw error
            })
        }
        checkUserAuth()
    }, [userStore.isLoginFlag])

    useEffect(() => {
        if(userStore.user){
            if (userStore.user.roleName.includes("ADMIN")) {
                dispatch(setAdminRoutes())
            } else {
                dispatch(setLoggedRoutes())
            }
            history.replace('/')
        }else{
            dispatch(setAnonymousRoutes())
        }
    }, [dispatch,userStore.user])

    useEffect(() => {
        history.listen((location) => {
            if(location.pathname.includes("/logout")) {
                dispatch(setLoading(true))
                fetch(`${commonStore.authBasename}/logout`, {
                    method:'POST',
                    headers:{
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }).then((response) => {
                    return response.json()
                }).then((response) => {
                    if (response) {
                        if (response.status === 'success') {
                            dispatch(setUser(null))
                            dispatch(setIsLoginFlag(false))
                            history.push('/')
                        } else if (response.status === 'failure') {
                            dispatch(setError(response.message))
                        }
                        dispatch(setLoading(false))
                    }
                }).catch((error) => {
                    dispatch(setLoading(false))
                    dispatch(setError(error.message))
                    throw error
                })
            }
        })
    }, [history])

    return (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <Navigation/>
                <Switch>
                    {
                        routerStore.routes.map(({path, Component}) => {
                            return (
                                <Route key={path} path={path} exact>
                                    <Container>
                                        {commonStore.loading ? <CircularProgress style={{ position: "fixed", top: "50%", left: "50%" }}/> : <Component/>}
                                    </Container>
                            </Route>
                            )
                        })
                    }
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
