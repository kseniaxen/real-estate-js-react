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
import {setCountries} from "../stores/CountryStore";
import {setTypes} from "../stores/TypeStore";
import {setTypeProperties} from "../stores/TypePropertyStore";
import {setCurrencies} from "../stores/CurrencyStore";
import {setUnits} from "../stores/UnitStore";

const theme = createTheme({
    palette: {
        primary: blue
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
                            dispatch(setUser(new UserModel(response.data.id, response.data.name, response.data.email, response.data.role_name, response.data.created_at)))
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

    const fetchCountries = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/country`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    dispatch(setCountries(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, "%20")
                        )
                    )))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchTypes = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/type`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    dispatch(setTypes(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, "%20")
                        )
                    )))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchTypeProperties = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/typeproperty`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    dispatch(setTypeProperties(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, "%20")
                        )
                    )))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchCurrencies = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/currency`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    dispatch(setCurrencies(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, "%20")
                        )
                    )))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchUnits = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/unit`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    dispatch(setUnits(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, "%20")
                        )
                    )))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        fetchCountries()
        fetchTypes()
        fetchTypeProperties()
        fetchCurrencies()
        fetchUnits()
    },[])

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
