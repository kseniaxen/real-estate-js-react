import React, {useEffect, useState} from 'react'
import {
    Button,
    Card, CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Fab,
    Grid, IconButton,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {setApartments, setCountApartments, setCountHouses, setHouses, setIsLoginFlag} from "../../stores/UserStore";
import AddIcon from "@material-ui/icons/Add";
import ApartmentIcon from '@material-ui/icons/Apartment';
import HomeIcon from '@material-ui/icons/Home';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {Pagination} from "@material-ui/lab";
import {setCountPages, setEndPage, setPage, setStartPage} from "../../stores/PaginationStore";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from "clsx";
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) => ({
    paper:{
        padding: theme.spacing(2)
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
    },
    fab:{
        margin: 0,
        top: 'auto',
        right: 30,
        bottom: 30,
        left: 'auto',
        position: 'fixed'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    center:{
        justify:'center'
    }
}))

export default function User(){
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const paginationStore = useSelector(state => state.PaginationStore)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [showNameError, setShowNameError] = useState(false)
    const [errorNameText, setErrorNameText] = useState('')
    const [showEmailError, setShowEmailError] = useState(false)
    const [errorEmailText, setErrorEmailText] = useState('')
    const [alignment, setAlignment] = useState('apartments');
    const [expanded, setExpanded] = useState({});

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

    const handleAlignment = (event,newAlignment) => {
        setAlignment(newAlignment);
    };

    useEffect(() => {
        if(alignment === 'apartments'){
            fetchUserCountApartments()
        }else{
            fetchUserCountHouses()
        }
    },[alignment])

    useEffect(() => {
        dispatch(setCountPages(userStore.countApartments))
        dispatch(setStartPage(paginationStore.page))
        dispatch(setEndPage(userStore.countApartments))
    },[userStore.countApartments])

    useEffect(() => {
        dispatch(setCountPages(userStore.countHouses))
        dispatch(setStartPage(paginationStore.page))
        dispatch(setEndPage(userStore.countHouses))
        if(userStore.houses.length === 0){
            fetchUserHouses()
        }
    },[userStore.countHouses])

    useEffect(() => {
        if(alignment === 'apartments'){
            fetchUserApartments()
        }else{
            fetchUserHouses()
        }
    },[paginationStore.page])

    const fetchUserCountApartments = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartmentuser/count`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response.status === 'success'){
                dispatch(setCountApartments(response.data))
            }else if(response.status === 'failure'){
                dispatch(setError(response.error))
            }
        }).catch((error) => {
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchUserCountHouses = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/houseuser/count`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response.status === 'success'){
                dispatch(setCountHouses(response.data))
            }else if(response.status === 'failure'){
                dispatch(setError(response.error))
            }
        }).catch((error) => {
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchUserApartments = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartmentuser/get`,{
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'start': paginationStore.startPage, 'end':paginationStore.endPage})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response.status === 'success'){
                dispatch(setApartments(response.data))
            }
        }).catch((error) => {
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchUserHouses = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/houseuser/get`,{
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'start': paginationStore.startPage, 'end':paginationStore.endPage})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response.status === 'success'){
                dispatch(setHouses(response.data))
            }
        }).catch((error) => {
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleChangePage = (event, value) => {
        if(alignment === 'apartments'){
            dispatch(setPage(value))
            dispatch(setStartPage(value))
            dispatch(setEndPage(userStore.countApartments))
        }else{
            dispatch(setPage(value))
            dispatch(setStartPage(value))
            dispatch(setEndPage(userStore.countHouses))
        }
    };

    useEffect(() => {
        setName(userStore.user.name)
        setEmail(userStore.user.email)
    }, [userStore.user])

    const handleExpandClick = (id) => {
        setExpanded({[id]: !expanded[id]});
    };

    return(
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={4}>
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
                <Grid item
                      xs={12}
                      sm={8}
                      md={8}>
                    <Grid container justify="center" alignItems="center" className={classes.flexColumn}>
                        <Typography variant="h5">Мои объявления</Typography>
                        <ToggleButtonGroup
                            value={alignment}
                            exclusive
                            onChange={handleAlignment}
                            aria-label="text alignment">
                            <ToggleButton value="apartments" aria-label="apartments">
                                <ApartmentIcon/>
                                Квартиры
                            </ToggleButton>
                            <ToggleButton value="houses" aria-label="houses">
                                <HomeIcon/>
                                Дома
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    {
                        (alignment === 'apartments') ?
                            <div>
                                <Grid container spacing={2}>
                                    {
                                        userStore.apartments.map((apart) => {
                                            return (
                                                <Grid item lg={6} md={6} xs={12}>
                                                    <Card>
                                                        <CardHeader
                                                            title={apart.title}
                                                            subheader={parseDate(apart.created_at)}/>
                                                        <CardMedia
                                                            className={classes.media}
                                                            image={apart.image}
                                                            title="apartment"
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body1" color="textSecondary" component="p">
                                                                {apart.country[0].name}, {apart.city[0].name}
                                                            </Typography>
                                                            <Typography variant="h4" color="primary">{apart.price} {apart.currency[0].name}</Typography>
                                                            <Typography variant="body1" color="textPrimary" component="p">
                                                                {apart.description}
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                Комнат - {apart.rooms} &#8226; {apart.area} м<sup>2</sup>
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions disableSpacing>
                                                            <IconButton
                                                                className={clsx(classes.expand, {
                                                                    [classes.expandOpen]: expanded[apart.id],
                                                                })}
                                                                onClick={()=>handleExpandClick(apart.id)}
                                                                aria-expanded={expanded}
                                                                aria-label="show more"
                                                            >
                                                                <ExpandMoreIcon />
                                                            </IconButton>
                                                        </CardActions>
                                                        <Collapse in={expanded[apart.id]} timeout="auto" unmountOnExit>
                                                            <CardContent>
                                                                <Typography paragraph variant="h5" gutterBottom>
                                                                    {apart.type[0].name}
                                                                </Typography>
                                                                <Typography paragraph>
                                                                    Комнат - {apart.rooms} &#8226; {apart.floor} этаж из {apart.floors}
                                                                </Typography>
                                                                <Typography paragraph>
                                                                    Площадь {apart.area} { (apart.residential_area ?` - ${apart.residential_area}`: "") } { (apart.kitchen_area ?` - ${apart.kitchen_area}`: "") }
                                                                </Typography>
                                                                <Typography paragraph color="textSecondary">
                                                                    Описание
                                                                </Typography>
                                                                <Typography paragraph style={{wordWrap:"break-word"}}>
                                                                    {apart.description}
                                                                </Typography>
                                                                <Paper className={classes.paper} style={{backgroundColor:'lightgrey'}}>
                                                                    <Typography paragraph variant="h6" gutterBottom>
                                                                        Связаться с {apart.name}
                                                                    </Typography>
                                                                    <Typography variant="h6">
                                                                        <a style={{textDecoration:'none'}} href={"tel:"+ apart.phone}>
                                                                            {apart.phone}
                                                                        </a>
                                                                    </Typography>
                                                                </Paper>
                                                            </CardContent>
                                                        </Collapse>
                                                    </Card>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                                <Grid container justify="center" alignItems="center">
                                    <Pagination count={paginationStore.countPages} page={paginationStore.page} onChange={handleChangePage} />
                                </Grid>
                            </div>
                            :
                            <div>
                                <Grid container spacing={2}>
                                    {
                                        userStore.houses.map((house) => {
                                            return (
                                                <Grid item lg={6} md={6} xs={12}>
                                                    <Card>
                                                        <CardHeader
                                                            title={house.title}
                                                            subheader={parseDate(house.created_at)}/>
                                                        <CardMedia
                                                            className={classes.media}
                                                            image={house.image}
                                                            title="house"
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body1" color="textSecondary" component="p">
                                                                {house.country[0].name}, {house.city[0].name}
                                                            </Typography>
                                                            <Typography variant="h4" color="primary">{house.price} {house.currency[0].name}</Typography>
                                                            <Typography variant="body1" color="textPrimary" component="p">
                                                                {house.description}
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                Комнат - {house.rooms} &#8226; {house.area} м<sup>2</sup> &#8226; {house.land_area} {house.unit[0].name}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions disableSpacing>
                                                            <IconButton
                                                                className={clsx(classes.expand, {
                                                                    [classes.expandOpen]: expanded[house.id],
                                                                })}
                                                                onClick={()=>handleExpandClick(house.id)}
                                                                aria-expanded={expanded}
                                                                aria-label="show more"
                                                            >
                                                                <ExpandMoreIcon />
                                                            </IconButton>
                                                        </CardActions>
                                                        <Collapse in={expanded[house.id]} timeout="auto" unmountOnExit>
                                                            <CardContent>
                                                                <Typography paragraph>
                                                                    Комнат - {house.rooms} &#8226; {house.floors} этаж
                                                                </Typography>
                                                                <Typography paragraph>
                                                                    Площадь {house.area} м<sup>2</sup> { (house.residential_area ?` - ${house.residential_area} м<sup>2</sup>`: "") } { (house.kitchen_area ?` - ${house.kitchen_area} м<sup>2</sup>`: "") }
                                                                </Typography>
                                                                <Typography paragraph>
                                                                    {house.land_area} {house.unit[0].name}
                                                                </Typography>
                                                                <Typography paragraph color="textSecondary">
                                                                    Описание
                                                                </Typography>
                                                                <Typography paragraph style={{wordWrap:"break-word"}}>
                                                                    {house.description}
                                                                </Typography>
                                                                <Paper className={classes.paper} style={{backgroundColor:'lightgrey'}}>
                                                                    <Typography paragraph variant="h6" gutterBottom>
                                                                        Связаться с {house.name}
                                                                    </Typography>
                                                                    <Typography variant="h6">
                                                                        <a style={{textDecoration:'none'}} href={"tel:"+ house.phone}>
                                                                            {house.phone}
                                                                        </a>
                                                                    </Typography>
                                                                </Paper>
                                                            </CardContent>
                                                        </Collapse>
                                                    </Card>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                                <Grid container justify="center" alignItems="center">
                                    <Pagination count={paginationStore.countPages} page={paginationStore.page} onChange={handleChangePage} />
                                </Grid>
                            </div>
                    }
                </Grid>
                <Fab color="primary" aria-label="add" className={classes.fab}>
                    <AddIcon />
                </Fab>
            </Grid>
        </div>
    )
}