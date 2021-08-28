import React, {useEffect, useState} from 'react'
import {Button, Grid, Paper, TextField, Typography} from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {setIsLoginFlag} from "../../stores/UserStore";

const useStyles = makeStyles((theme) => ({
    paper:{
        padding: theme.spacing(2),
        //minWidth:'200px'
    },
    icon:{
        width:40,
        height:40,
        color:'grey'
    },
    flexRow:{
        display:'flex',
        flexDirection:'row',
        paddingBottom:20
    },
    flexColumn:{
        display:'flex',
        flexDirection:'column'
    },
    textNameUser:{
        color:'grey',
        margin:5
    },
    field:{
        marginBottom:'20px'
    }
}))

export default function User(){
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [showNameError, setShowNameError] = useState(false)
    const [errorNameText, setErrorNameText] = useState('')
    const [showEmailError, setShowEmailError] = useState(false)
    const [errorEmailText, setErrorEmailText] = useState('')

    const classes = useStyles();
    const dispatch = useDispatch()

    const parseDate = (ms) => {
        let date = new Date(ms);
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
        };
        return date.toLocaleDateString('eu', options);
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmitChange = (e) => {
        e.preventDefault()
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.authBasename}/edit`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({'name':name, 'email':email})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response.status === 'success'){
                setShowEmailError(false)
                setErrorEmailText('')
                setShowNameError(false)
                setErrorNameText('')
                dispatch(setIsLoginFlag(!userStore.isLoginFlag))
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
                }
            }
        }).catch((error) => {
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        setName(userStore.user.name)
        setEmail(userStore.user.email)
    }, [userStore.user])

    return(
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Paper className={classes.paper} >
                        <div className={classes.flexRow}>
                            <AccountCircleIcon className={classes.icon}/>
                            <Typography variant="h5" className={classes.textNameUser}>{userStore.user.name}</Typography>
                        </div>
                        <div className={classes.flexColumn}>
                            <TextField error={showNameError}
                                       helperText={errorNameText.length !== 0 ? errorNameText : ''}
                                       id="name"
                                       label="Имя"
                                       variant="outlined"
                                       value={name}
                                       onChange={handleNameChange}
                                       className={classes.field}
                            />
                            <TextField error={showEmailError}
                                       helperText={errorEmailText.length !== 0 ? errorEmailText : ''}
                                       id="email"
                                       label="Email"
                                       variant="outlined"
                                       value={email}
                                       onChange={handleEmailChange}
                                       className={classes.field}
                            />
                            <Button variant="contained"
                                    color="primary"
                                    onClick={handleSubmitChange}
                            >
                                Сохранить
                            </Button>
                            <Typography className={classes.textNameUser}>Аккаунт создан: {parseDate(userStore.user.createdAt)}</Typography>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}