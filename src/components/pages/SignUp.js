import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, TextField} from "@material-ui/core";
import {Card} from "react-bootstrap";
import {clearError, setError} from "../../stores/CommonStore";
import history from "../../history";
import ModalSignUp from "../common/ModalSignUp";

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

export default function SignUp(){
    const commonStore = useSelector(state => state.CommonStore)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [showNameError, setShowNameError] = useState(false)
    const [errorNameText, setErrorNameText] = useState('')
    const [showEmailError, setShowEmailError] = useState(false)
    const [errorEmailText, setErrorEmailText] = useState('')
    const [showPasswordError, setShowPasswordError] = useState(false)
    const [errorPasswordText, setErrorPasswordText] = useState('')
    const [modalShow, setModalShow] = useState(false);

    const classes = useStyles();

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(clearError())
        fetch(`${commonStore.authBasename}/register`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name':encodeURIComponent(name), 'email':email, 'password':password})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.status === 'success') {
                setShowNameError(false)
                setErrorNameText('')
                setShowEmailError(false)
                setErrorEmailText('')
                setShowPasswordError(false)
                setErrorPasswordText('')
                setModalShow(true)
            }else{
                if(response.data){
                    if(response.data.name){
                        setShowNameError(true)
                        setErrorNameText(response.data.name[0])
                    }else{
                        setShowNameError(false)
                        setErrorNameText('')
                    }
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
                        <Card.Title>Регистрация</Card.Title>
                        <Card.Text className={classes.cardText}>
                            <form autoComplete="off">
                                <div className={classes.flex}>
                                    <TextField error={showNameError ? true : false}
                                               helperText={errorNameText.length !== 0 ? errorNameText : ''}
                                               id="name"
                                               label="Имя пользователя"
                                               value={name}
                                               onChange={handleNameChange} />
                                    <TextField error={showEmailError ? true : false}
                                               helperText={errorEmailText.length !== 0 ? errorEmailText : ''}
                                               id="email"
                                               label="Email"
                                               value={email}
                                               onChange={handleEmailChange} />
                                    <TextField error={showPasswordError ? true : false}
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
                        <Button variant="contained" color="primary" id="button" onClick={handleSubmit}>
                            Зарегистрироваться
                        </Button>
                    </Card.Body>
                </Card>
            </Grid>
            <ModalSignUp
                show={modalShow}
                onHide={() => {setModalShow(false)
                    history.replace('/signin')}}
            />
        </Grid>
    )
}