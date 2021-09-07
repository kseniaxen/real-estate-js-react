import React, {useEffect, useState} from 'react'
import {
    Button,
    Card,
    CardActions,
    CardContent, CardHeader, CardMedia,
    CircularProgress, Drawer, Fab,
    FormControl, FormControlLabel, FormLabel,
    Grid, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup,
    Select, TextField,
    Typography
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {
    historyPush,
    setAreaFromFilter,
    setAreaToFilter,
    setCityFilter,
    setCountApartment,
    setCountryFilter, setCurrencyFilter,
    setEnd,
    setFloorFromFilter,
    setFloorsFromFilter,
    setFloorsToFilter,
    setFloorToFilter,
    setPriceFromFilter, setPriceToFilter,
    setRoomsFilter,
    setTypeFilter
} from "../../stores/ApartmentStore";
import {makeStyles} from "@material-ui/core/styles";
import {setCities} from "../../stores/CityStore";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SearchIcon from '@material-ui/icons/Search';
import Lightbox from "react-image-lightbox";

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        [theme.breakpoints.down("md")]: {
            minWidth: 200
        },
        [theme.breakpoints.down("sm")]: {
            minWidth: 100
        }
    },
    media: {
        height: 0,
        paddingTop: '50%', // 16:9
    },
    h6:{
        marginLeft:'5px',
        color:'grey',
        fontWeight:'normal'
    },
    icon:{
        color:'grey',
        width:'20px',
        height:'20px',
    },
    loader:{
        position: "fixed",
        top: "50%",
        left: "60%",
        [theme.breakpoints.down("xs")]: {
            position: "fixed",
            top: "50%",
            left: "45%"
        }
    },
    fab:{
        display:'none',
        [theme.breakpoints.down("xs")]: {
            display:'block',
            margin: 0,
            top: 'auto',
            right: 30,
            bottom: 30,
            left: 'auto',
            position: 'fixed'
        }
    },
    filter:{
        display:'block',
        [theme.breakpoints.down("xs")]: {
            display:'none',
        }
    },
    currency:{
        maxWidth:'50px'
    },
    paper:{
        padding: theme.spacing(2)
    }
}))

export default function Apartments(){
    const FETCH_DATA_COUNT = 4
    const commonStore = useSelector(state => state.CommonStore)
    const apartmentStore = useSelector(state => state.ApartmentStore)
    const typeStore = useSelector(state => state.TypeStore)
    const countryStore = useSelector(state => state.CountryStore)
    const cityStore = useSelector(state => state.CityStore)
    const currencyStore = useSelector(state => state.CurrencyStore)
    const [expanded, setExpanded] = useState({});
    const [openSidePanel, setOpenSidePanel] = useState(false)
    const [openImage, setOpenImage] = useState(false)
    const [image, setImage] = useState("")
    const classes = useStyles();
    const dispatch = useDispatch()

    const [hasMore, setHasMore] = useState(true)
    const [apartments, setApartments] = useState([])

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenSidePanel(open);
    }

    const fetchCountApartments = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartment/count`
        ).then((response) => {
            return response.json()
        }).then(response => {
            if(response){
                if (response.status === 'success') {
                    dispatch(setCountApartment(response.data))
                }else{
                    dispatch(setError(response.error))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchApartments = (start, end) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartment`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body:JSON.stringify({'start':start, 'end':end})
        }).then((response) => {
            return response.json()
        }).then(response => {
            if(response){
                if (response.status === 'success') {
                    setApartments(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(response.data)
                                .replace(/(%2E)/ig, "%20")
                        )))
                }else{
                    dispatch(setError(response.error))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchMoreApartments = () => {
        if (apartments.length >= apartmentStore.count) {
            setHasMore(false)
            dispatch(setEnd(FETCH_DATA_COUNT))
            return
        }else{
            dispatch(setEnd(apartmentStore.end + FETCH_DATA_COUNT))
            fetchApartments(apartmentStore.start, apartmentStore.end)
        }
    }

    useEffect(() => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        if(search.includes('?')){
            if(params.get('typeId')){
                dispatch(setTypeFilter(params.get('typeId')))
            }
            if(params.get('countryId')){
                dispatch(setCountryFilter(params.get('countryId')))
                fetchCitiesByCountryId(params.get('countryId'))
                if(params.get('cityId')){
                    dispatch(setCityFilter(params.get('cityId')))
                }
            }
            if(params.get('rooms')){
                dispatch(setRoomsFilter(params.get('rooms')))
            }
            if(params.get('floorFrom')){
                dispatch(setFloorFromFilter(params.get('floorFrom')))
            }
            if(params.get('floorTo')){
                dispatch(setFloorToFilter(params.get('floorTo')))
            }
            if(params.get('floorsFrom')){
                dispatch(setFloorsFromFilter(params.get('floorsFrom')))
            }
            if(params.get('floorsTo')){
                dispatch(setFloorsToFilter(params.get('floorsTo')))
            }
            if(params.get('areaFrom')){
                dispatch(setAreaFromFilter(params.get('areaFrom')))
            }
            if(params.get('areaTo')){
                dispatch(setAreaToFilter(params.get('areaTo')))
            }
            if(params.get('priceFrom')){
                dispatch(setPriceFromFilter(params.get('priceFrom')))
            }
            if(params.get('priceTo')){
                dispatch(setPriceToFilter(params.get('priceTo')))
            }
            if(params.get('currencyId')){
                dispatch(setCurrencyFilter(params.get('currencyId')))
            }
            fetchFilteredApartments(search)
        }else{
            fetchCountApartments()
            fetchApartments(apartmentStore.start, apartmentStore.end)
        }
    },[])

    const handleChangeType = (e) => {
        dispatch(setTypeFilter(e.target.value))
        dispatch(historyPush())
    }

    const handleChangeCountry = (e) => {
        dispatch(setCountryFilter(e.target.value))
        dispatch(historyPush())
        fetchCitiesByCountryId(e.target.value)
    }

    const fetchCitiesByCountryId = (countryId) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/city?country=${countryId}`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    dispatch(setCities(JSON.parse(
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

    const handleChangeCity = (e) => {
        dispatch(setCityFilter(e.target.value))
        dispatch(historyPush())
    }

    const handleChangeRooms = (e) => {
        dispatch(setRoomsFilter(e.target.value))
        dispatch(historyPush())
    }

    const handleFloorFromChange = (e) => {
        dispatch(setFloorFromFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handleFloorToChange = (e) => {
        dispatch(setFloorToFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handleFloorsFromChange = (e) => {
        dispatch(setFloorsFromFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handleFloorsToChange = (e) => {
        dispatch(setFloorsToFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handleAreaFromChange = (e) => {
        dispatch(setAreaFromFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handleAreaToChange = (e) => {
        dispatch(setAreaToFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handlePriceFromChange = (e) => {
        dispatch(setPriceFromFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handlePriceToChange = (e) => {
        dispatch(setPriceToFilter(Number(e.target.value)))
        dispatch(historyPush())
    }

    const handleChangeCurrency = (e) => {
        dispatch(setCurrencyFilter(e.target.value))
        dispatch(historyPush())
    }

    const parseDate = (ms) => {
        let date = new Date(ms);
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
        };
        return date.toLocaleDateString('ru', options);
    }

    const handleExpandClick = (id) => {
        setExpanded({[id]: !expanded[id]});
    };

    const handleSearch = () => {
        const windowUrl = window.location.search
        fetchFilteredApartments(windowUrl)
    }

    const fetchFilteredApartments = (windowUrl) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartment${windowUrl.replace(/\\s/g, '')}`)
            .then((response) => {
                return response.json()
            }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    setApartments(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, "%20")
                        )))
                } else if (responseModel.status === 'fail') {
                    dispatch(setError(responseModel.message))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    return(
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={4} className={classes.filter}>
                    <Paper elevation={2} className={classes.paper}>
                        <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="type">Тип</InputLabel>
                            <Select
                                labelId="type"
                                id="type"
                                value={apartmentStore.typeFilter}
                                onChange={handleChangeType}
                            >
                                {
                                    typeStore.types.map(type => {
                                        return <MenuItem value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="country">Страна</InputLabel>
                            <Select
                                labelId="country"
                                id="country"
                                value={apartmentStore.countryFilter}
                                onChange={handleChangeCountry}
                            >
                                {
                                    countryStore.countries.map(country => {
                                        return <MenuItem value={country.id}>
                                            {country.name}
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        {
                            cityStore.cities.length > 0 ? (
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="city">Город</InputLabel>
                                    <Select
                                        labelId="city"
                                        id="city"
                                        value={apartmentStore.cityFilter}
                                        onChange={handleChangeCity}
                                    >
                                        {
                                            cityStore.cities.map(city => {
                                                return <MenuItem value={city.id}>
                                                    {city.name}
                                                </MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            ): ''
                        }
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Комнат</FormLabel>
                            <RadioGroup aria-label="rooms" name="rooms" value={apartmentStore.rooms} onChange={handleChangeRooms} style={{display:'flex', flexDirection:'row'}}>
                                <FormControlLabel value={"1"} control={<Radio />} label="1" />
                                <FormControlLabel value={"2"} control={<Radio />} label="2" />
                                <FormControlLabel value={"3"} control={<Radio />} label="3" />
                                <FormControlLabel value={"4"} control={<Radio />} label="4+" />
                            </RadioGroup>
                        </FormControl>
                        <div>
                            <Typography variant="h6">Этаж</Typography>
                            <TextField
                                id="floorFrom"
                                label={'от'}
                                type='number'
                                inputProps={{'min': 1, 'max': 50}}
                                value={apartmentStore.floorFrom}
                                onChange={handleFloorFromChange}
                            />
                            <TextField
                                id="floorTo"
                                label={'до'}
                                type='number'
                                inputProps={{'min': 1, 'max': 50}}
                                value={apartmentStore.floorTo}
                                onChange={handleFloorToChange}
                                style={{marginLeft:'20px'}}
                            />
                        </div>
                        <div>
                            <Typography variant="h6">Этажей</Typography>
                            <TextField
                                id="floorsFrom"
                                label={'от'}
                                type='number'
                                inputProps={{'min': 1, 'max': 50}}
                                value={apartmentStore.floorsFrom}
                                onChange={handleFloorsFromChange}
                            />
                            <TextField
                                id="floorsTo"
                                label={'до'}
                                type='number'
                                inputProps={{'min': 1, 'max': 50}}
                                value={apartmentStore.floorsTo}
                                onChange={handleFloorsToChange}
                                style={{marginLeft:'20px'}}
                            />
                        </div>
                        <div>
                            <Typography variant="h6">Площадь помещений, м<sup>2</sup></Typography>
                            <TextField
                                id="areaFrom"
                                label={'от'}
                                type='number'
                                inputProps={{'min': 1, 'max': 50}}
                                value={apartmentStore.areaFrom}
                                onChange={handleAreaFromChange}
                            />
                            <TextField
                                id="areaTo"
                                label={'до'}
                                type='number'
                                inputProps={{'min': 1, 'max': 50}}
                                value={apartmentStore.areaTo}
                                onChange={handleAreaToChange}
                                style={{marginLeft:'20px'}}
                            />
                        </div>
                        <div>
                            <Typography variant="h6">Цена</Typography>
                            <TextField
                                id="priceFrom"
                                label={'от'}
                                value={apartmentStore.priceFrom}
                                onChange={handlePriceFromChange}
                                style={{maxWidth:'70px'}}
                            />
                            <TextField
                                id="priceTo"
                                label={'до'}
                                value={apartmentStore.priceTo}
                                onChange={handlePriceToChange}
                                style={{marginLeft:'20px', maxWidth:'70px'}}
                            />
                            <FormControl style={{marginLeft:'5px'}}
                                className={classes.currency}>
                                <InputLabel id="currency">Валюта</InputLabel>
                                <Select
                                    labelId="currency"
                                    id="currency"
                                    value={apartmentStore.currency}
                                    onChange={handleChangeCurrency}
                                >
                                    {
                                        currencyStore.currencies.map(currency => {
                                            return <MenuItem value={currency.id}>
                                                {currency.name}
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <Button variant="contained"
                                color="primary"
                                style={{marginTop:'10px'}}
                                onClick={handleSearch}>
                            Поиск
                        </Button>
                    </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                    <InfiniteScroll
                        next={fetchMoreApartments}
                        hasMore={hasMore}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Это все!</b>
                            </p>
                        }
                        loader={ <p className={classes.loader}>
                            <CircularProgress/>
                        </p>
                        }
                        dataLength={apartments.length}>
                        {
                            apartments.map(apart => {
                                return <Card className={classes.root}>
                                        <CardHeader
                                            title={apart.title}
                                            subheader={
                                                <div style={{display:'flex', flexDirection:'row'}}>
                                                    <AccessTimeIcon className={classes.icon}/>
                                                    <h6 className={classes.h6}>{parseDate(apart.created_at)}</h6>
                                                </div>
                                            }>
                                        </CardHeader>
                                    <CardMedia
                                        className={classes.media}
                                        image={apart.image}
                                        title="apartment"
                                        style={{cursor: 'pointer'}}
                                        onClick={ () => {
                                            setOpenImage(true)
                                            setImage(apart.image)
                                            }
                                        }
                                    />
                                        <CardContent>
                                            <Typography variant="body1" color="textSecondary"
                                                        component="p">
                                                {apart.country[0].name}, {apart.city[0].name}
                                            </Typography>
                                            <Typography variant="h4"
                                                        color="primary">{apart.price} {apart.currency[0].name}</Typography>
                                            <Typography variant="body1" color="textPrimary"
                                                        component="p">
                                                {apart.description}
                                            </Typography>
                                            <Typography variant="body1">
                                                Комнат
                                                - {apart.rooms} &#8226; {apart.area} м<sup>2</sup>
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            <IconButton
                                                className={clsx(classes.expand, {
                                                    [classes.expandOpen]: expanded[apart.id],
                                                })}
                                                onClick={() => handleExpandClick(apart.id)}
                                                aria-expanded={expanded}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon/>
                                            </IconButton>
                                        </CardActions>
                                    <Collapse in={expanded[apart.id]} timeout="auto"
                                              unmountOnExit>
                                        <CardContent>
                                            <Typography paragraph variant="h5" gutterBottom>
                                                {apart.type[0].name}
                                            </Typography>
                                            <Typography paragraph>
                                                Комнат
                                                - {apart.rooms} &#8226; {apart.floor} этаж
                                                из {apart.floors}
                                            </Typography>
                                            <Typography paragraph>
                                                Площадь {apart.area} {(apart.residential_area ? ` - ${apart.residential_area}` : "")} {(apart.kitchen_area ? ` - ${apart.kitchen_area}` : "")} м<sup>2</sup>
                                            </Typography>
                                            <Typography paragraph color="textSecondary">
                                                Описание
                                            </Typography>
                                            <Typography paragraph
                                                        style={{wordWrap: "break-word"}}>
                                                {apart.description}
                                            </Typography>
                                            <Paper className={classes.paper}
                                                   style={{backgroundColor: 'lightgrey'}}>
                                                <Typography paragraph variant="h6"
                                                            gutterBottom>
                                                    Связаться с {apart.name}
                                                </Typography>
                                                <Typography variant="h6">
                                                    <a style={{textDecoration: 'none'}}
                                                       href={"tel:" + apart.phone}>
                                                        {apart.phone}
                                                    </a>
                                                </Typography>
                                            </Paper>
                                        </CardContent>
                                    </Collapse>
                                    </Card>
                            })
                        }
                    </InfiniteScroll>
                </Grid>
            </Grid>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => {
                setOpenSidePanel(true)}
            }>
                <SearchIcon/>
            </Fab>
            <Drawer
                open={openSidePanel}
                onClose={toggleDrawer(false)}>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="type">Тип</InputLabel>
                        <Select
                            labelId="type"
                            id="type"
                            value={apartmentStore.typeFilter}
                            onChange={handleChangeType}
                        >
                            {
                                typeStore.types.map(type => {
                                    return <MenuItem value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="country">Страна</InputLabel>
                        <Select
                            labelId="country"
                            id="country"
                            value={apartmentStore.countryFilter}
                            onChange={handleChangeCountry}
                        >
                            {
                                countryStore.countries.map(country => {
                                    return <MenuItem value={country.id}>
                                        {country.name}
                                    </MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    {
                        cityStore.cities.length > 0 ? (
                            <FormControl className={classes.formControl}>
                                <InputLabel id="city">Город</InputLabel>
                                <Select
                                    labelId="city"
                                    id="city"
                                    value={apartmentStore.cityFilter}
                                    onChange={handleChangeCity}
                                >
                                    {
                                        cityStore.cities.map(city => {
                                            return <MenuItem value={city.id}>
                                                {city.name}
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        ): ''
                    }
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Комнат</FormLabel>
                        <RadioGroup aria-label="rooms" name="rooms" value={apartmentStore.rooms} onChange={handleChangeRooms} style={{display:'flex', flexDirection:'row'}}>
                            <FormControlLabel value={"1"} control={<Radio />} label="1" />
                            <FormControlLabel value={"2"} control={<Radio />} label="2" />
                            <FormControlLabel value={"3"} control={<Radio />} label="3" />
                            <FormControlLabel value={"4"} control={<Radio />} label="4+" />
                        </RadioGroup>
                    </FormControl>
                    <div>
                        <Typography variant="h6">Этаж</Typography>
                        <TextField
                            id="floorFrom"
                            label={'от'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={apartmentStore.floorFrom}
                            onChange={handleFloorFromChange}
                        />
                        <TextField
                            id="floorTo"
                            label={'до'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={apartmentStore.floorTo}
                            onChange={handleFloorToChange}
                            style={{marginLeft:'20px'}}
                        />
                    </div>
                    <div>
                        <Typography variant="h6">Этажей</Typography>
                        <TextField
                            id="floorsFrom"
                            label={'от'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={apartmentStore.floorsFrom}
                            onChange={handleFloorsFromChange}
                        />
                        <TextField
                            id="floorsTo"
                            label={'до'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={apartmentStore.floorsTo}
                            onChange={handleFloorsToChange}
                            style={{marginLeft:'20px'}}
                        />
                    </div>
                    <div>
                        <Typography variant="h6">Площадь помещений, м<sup>2</sup></Typography>
                        <TextField
                            id="areaFrom"
                            label={'от'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={apartmentStore.areaFrom}
                            onChange={handleAreaFromChange}
                        />
                        <TextField
                            id="areaTo"
                            label={'до'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={apartmentStore.areaTo}
                            onChange={handleAreaToChange}
                            style={{marginLeft:'20px'}}
                        />
                    </div>
                    <div>
                        <Typography variant="h6">Цена</Typography>
                        <TextField
                            id="priceFrom"
                            label={'от'}
                            value={apartmentStore.priceFrom}
                            onChange={handlePriceFromChange}
                            style={{maxWidth:'70px'}}
                        />
                        <TextField
                            id="priceTo"
                            label={'до'}
                            value={apartmentStore.priceTo}
                            onChange={handlePriceToChange}
                            style={{marginLeft:'20px', maxWidth:'70px'}}
                        />
                        <FormControl style={{marginLeft:'5px'}}
                                     className={classes.currency}>
                            <InputLabel id="currency">Валюта</InputLabel>
                            <Select
                                labelId="currency"
                                id="currency"
                                value={apartmentStore.currency}
                                onChange={handleChangeCurrency}
                            >
                                {
                                    currencyStore.currencies.map(currency => {
                                        return <MenuItem value={currency.id}>
                                            {currency.name}
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <Button variant="contained"
                            color="primary"
                            style={{marginTop:'10px'}}
                            onClick={() => {
                                handleSearch()
                                setOpenSidePanel(false)
                                }
                            }>
                        Поиск
                    </Button>
                </div>
            </Drawer>
            {
                openImage && (
                    <Lightbox mainSrc={image} onCloseRequest={() => setOpenImage(false)}/>
                )
            }
        </div>
    )
}