import React, {useState} from 'react'
import {useSelector, useDispatch} from "react-redux"
import {Card} from "react-bootstrap";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import {clearError, setError} from "../../stores/CommonStore";
import {setIsLoginFlag} from "../../stores/UserStore";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '75vh'
    },
    cardText:{
        marginTop:'10px'
    },
    text:{
        textAlign:'center'
    },
    flex:{
        [theme.breakpoints.down("sm")]:{
            display:'flex',
            flexDirection:'column'
        }
    },
    error:{
        color:'red'
    }
}))

export default function SignIn(){
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showEmailError, setShowEmailError] = useState(false)
    const [errorEmailText, setErrorEmailText] = useState('')
    const [showPasswordError, setShowPasswordError] = useState(false)
    const [errorPasswordText, setErrorPasswordText] = useState('')
    const [showUnauthError, setShowUnauthError] = useState(false)

    const classes = useStyles();

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(clearError())
        fetch(`${commonStore.authBasename}/login`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.status === 'success') {
                setShowEmailError(false)
                setErrorEmailText('')
                setShowPasswordError(false)
                setErrorPasswordText('')
                setShowUnauthError(false)
                dispatch(setIsLoginFlag(!userStore.isLoginFlag))
                localStorage.setItem('token', response.data.token)
            }else{
                if(response.message === "Unauthorized user"){
                    setShowUnauthError(true)
                }else{
                    setShowUnauthError(false)
                    setErrorPasswordText('')
                }
                if(response.data){
                    if(response.data.email){
                        setShowEmailError(true)
                        setErrorEmailText(response.data.email[0])
                    }else{
                        setShowEmailError(false)
                        setErrorEmailText('')
                    }
                    if(response.data.password){
                        setShowPasswordError(true)
                        setErrorPasswordText(response.data.password[0])
                    }else{
                        setShowPasswordError(false)
                        setErrorPasswordText('')
                    }
                }
                dispatch(setError(response.message))
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
    }

    return(
        <Grid container
              spacing={0}
              direction='column'
              alignContent='center'
              justifyContent='center'
              className={classes.root}>
            <Grid item
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                  xl={3}
            >
                <Card>
                    <Card.Body className={classes.text}>
                        <Card.Title>Вход</Card.Title>
                        <Card.Text className={classes.cardText}>
                            <form autoComplete="off">
                                <div className={classes.flex}>
                                    <TextField error={showEmailError}
                                               helperText={errorEmailText.length !== 0 ? errorEmailText : ''}
                                               id="email"
                                               label="Email"
                                               value={email}
                                               onChange={handleEmailChange} />
                                    <TextField  error={showPasswordError}
                                                helperText={errorPasswordText.length !== 0 ? errorPasswordText : ''}
                                                id="password"
                                                label="Пароль"
                                                value={password}
                                                type="password"
                                                onChange={handlePasswordChange}
                                    />
                                </div>
                            </form>
                        </Card.Text>
                        {
                            showUnauthError ? <Typography className={classes.error} >Login or password is wrong</Typography>: ''
                        }
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Войти
                        </Button>
                    </Card.Body>
                </Card>
            </Grid>
        </Grid>
    )
}