import React, {useEffect, useState} from 'react'
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {setCities} from "../../stores/CityStore";
import {
    Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid, IconButton,
    InputLabel,
    MenuItem, Paper, Radio,
    RadioGroup,
    Select, TextField, Typography
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import {setCountHouses} from "../../stores/UserStore";
import {
    historyPush,
    setAreaFromFilter,
    setAreaToFilter,
    setCityFilter,
    setCountryFilter,
    setCurrencyFilter,
    setEnd,
    setFloorsFromFilter,
    setFloorsToFilter,
    setLandAreaFromFilter,
    setLandAreaToFilter,
    setPriceFromFilter,
    setPriceToFilter,
    setRoomsFilter,
    setTypeFilter,
    setUnitFilter
} from "../../stores/HouseStore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

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
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
}))

export default function Houses(){
    const FETCH_DATA_COUNT = 4
    const commonStore = useSelector(state => state.CommonStore)
    const houseStore = useSelector(state => state.HouseStore)
    const typeStore = useSelector(state => state.TypeStore)
    const countryStore = useSelector(state => state.CountryStore)
    const cityStore = useSelector(state => state.CityStore)
    const currencyStore = useSelector(state => state.CurrencyStore)
    const unitStore = useSelector(state => state.UnitStore)
    const [expanded, setExpanded] = useState({});
    const classes = useStyles();
    const dispatch = useDispatch()

    const [hasMore, setHasMore] = useState(true)
    const [houses, setHouses] = useState([])

    const fetchCountHouses = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/house/count`
        ).then((response) => {
            return response.json()
        }).then(response => {
            if(response){
                if (response.status === 'success') {
                    dispatch(setCountHouses(response.data))
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

    const fetchHouses = (start, end) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/house`,{
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
                    setHouses(JSON.parse(
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

    const fetchMoreHouses = () => {
        if (houses.length >= houseStore.count) {
            setHasMore(false)
            dispatch(setEnd(FETCH_DATA_COUNT))
            return
        }else{
            dispatch(setEnd(houseStore.end + FETCH_DATA_COUNT))
            fetchHouses(houseStore.start, houseStore.end)
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
            if(params.get('landFrom')){
                dispatch(setLandAreaFromFilter(params.get('landFrom')))
            }
            if(params.get('landTo')){
                dispatch(setLandAreaToFilter(params.get('landTo')))
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
            if(params.get('unitId')){
                dispatch(setUnitFilter(params.get('unitId')))
            }
            fetchFilteredHouses(search)
        }else{
            fetchCountHouses()
            fetchHouses(houseStore.start, houseStore.end)
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

    const handleChangeUnit = (e) => {
        dispatch(setUnitFilter(e.target.value))
        dispatch(historyPush())
    }

    const handleChangeLandAreaFrom = (e) => {
        dispatch(setLandAreaFromFilter(e.target.value))
        dispatch(historyPush())
    }

    const handleChangeLandAreaTo = (e) => {
        dispatch(setLandAreaToFilter(e.target.value))
        dispatch(historyPush())
    }

    const parseDate = (ms) => {
        let date = new Date(ms);
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
        };
        return date.toLocaleDateString('eu', options);
    }

    const handleExpandClick = (id) => {
        setExpanded({[id]: !expanded[id]});
    };

    const handleSearch = () => {
        const windowUrl = window.location.search
        fetchFilteredHouses(windowUrl)
    }

    const fetchFilteredHouses = (windowUrl) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/house${windowUrl.replace(/\\s/g, '')}`)
            .then((response) => {
                return response.json()
            }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    setHouses(JSON.parse(
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
                <Grid item xs={12} sm={4} md={4}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="type">Тип</InputLabel>
                        <Select
                            labelId="type"
                            id="type"
                            value={houseStore.typeFilter}
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
                            value={houseStore.countryFilter}
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
                                    value={houseStore.cityFilter}
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
                        <RadioGroup aria-label="rooms" name="rooms" value={houseStore.rooms} onChange={handleChangeRooms} style={{display:'flex', flexDirection:'row'}}>
                            <FormControlLabel value={"1"} control={<Radio />} label="1" />
                            <FormControlLabel value={"2"} control={<Radio />} label="2" />
                            <FormControlLabel value={"3"} control={<Radio />} label="3" />
                            <FormControlLabel value={"4"} control={<Radio />} label="4+" />
                        </RadioGroup>
                    </FormControl>
                    <div>
                        <Typography variant="h6">Этажей</Typography>
                        <TextField
                            id="floorsFrom"
                            label={'от'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={houseStore.floorsFrom}
                            onChange={handleFloorsFromChange}
                        />
                        <TextField
                            id="floorsTo"
                            label={'до'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={houseStore.floorsTo}
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
                            value={houseStore.areaFrom}
                            onChange={handleAreaFromChange}
                        />
                        <TextField
                            id="areaTo"
                            label={'до'}
                            type='number'
                            inputProps={{'min': 1, 'max': 50}}
                            value={houseStore.areaTo}
                            onChange={handleAreaToChange}
                            style={{marginLeft:'20px'}}
                        />
                    </div>
                    <div>
                        <Typography variant="h6">Площадь участка</Typography>
                        <TextField
                            id="landAreaFrom"
                            label={'от'}
                            type='number'
                            inputProps={{'min': 1}}
                            value={houseStore.landAreaFrom}
                            onChange={handleChangeLandAreaFrom}
                            style={{maxWidth:'80px'}}
                        />
                        <TextField
                            id="landAreaTo"
                            label={'до'}
                            type='number'
                            inputProps={{'min': 1}}
                            value={houseStore.landAreaTo}
                            onChange={handleChangeLandAreaTo}
                            style={{marginLeft:'20px', maxWidth:'80px'}}
                        />
                    </div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="unit">Единица измерения</InputLabel>
                        <Select
                            labelId="unit"
                            id="unit"
                            value={houseStore.unit}
                            onChange={handleChangeUnit}
                        >
                            {
                                unitStore.units.map(unit => {
                                    return <MenuItem value={unit.id}>
                                        {unit.name}
                                    </MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <div>
                        <Typography variant="h6">Цена</Typography>
                        <TextField
                            id="priceFrom"
                            label={'от'}
                            value={houseStore.priceFrom}
                            onChange={handlePriceFromChange}
                            style={{maxWidth:'80px'}}
                        />
                        <TextField
                            id="priceTo"
                            label={'до'}
                            value={houseStore.priceTo}
                            onChange={handlePriceToChange}
                            style={{marginLeft:'20px', maxWidth:'80px'}}
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="currency">Валюта</InputLabel>
                            <Select
                                labelId="currency"
                                id="currency"
                                value={houseStore.currency}
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
                            onClick={handleSearch}>
                        Поиск
                    </Button>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                    <InfiniteScroll
                        next={fetchMoreHouses}
                        hasMore={hasMore}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Это все!</b>
                            </p>
                        }
                        loader={ <p style={{ textAlign: 'center' }}>
                            <CircularProgress/>
                        </p>
                        }
                        dataLength={houses.length}>
                        {
                            houses.map(house => {
                                return   <Card>
                                        <CardHeader
                                            title={house.title}
                                            subheader={parseDate(house.created_at)}/>
                                        <CardMedia
                                            className={classes.media}
                                            image={house.image}
                                            title="house"
                                        />
                                        <CardContent>
                                            <Typography variant="body1" color="textSecondary"
                                                        component="p">
                                                {house.country[0].name}, {house.city[0].name}
                                            </Typography>
                                            <Typography variant="h4"
                                                        color="primary">{house.price} {house.currency[0].name}</Typography>
                                            <Typography variant="body1" color="textPrimary"
                                                        component="p">
                                                {house.description}
                                            </Typography>
                                            <Typography variant="body1">
                                                Комнат
                                                - {house.rooms} &#8226; {house.area} м<sup>2</sup> &#8226; {house.land_area} {house.unit[0].name}
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            <IconButton
                                                className={clsx(classes.expand, {
                                                    [classes.expandOpen]: expanded[house.id],
                                                })}
                                                onClick={() => handleExpandClick(house.id)}
                                                aria-expanded={expanded}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon/>
                                            </IconButton>
                                        </CardActions>
                                        <Collapse in={expanded[house.id]} timeout="auto"
                                                  unmountOnExit>
                                            <CardContent>
                                                <Typography paragraph>
                                                    Комнат
                                                    - {house.rooms} &#8226; {house.floors} этаж
                                                </Typography>
                                                <Typography paragraph>
                                                    Площадь {house.area} {(house.residential_area ? ` - ${house.residential_area} ` : "")} {(house.kitchen_area ? ` - ${house.kitchen_area}` : "")} м<sup>2</sup>
                                                </Typography>
                                                <Typography paragraph>
                                                    {house.land_area} {house.unit[0].name}
                                                </Typography>
                                                <Typography paragraph color="textSecondary">
                                                    Описание
                                                </Typography>
                                                <Typography paragraph
                                                            style={{wordWrap: "break-word"}}>
                                                    {house.description}
                                                </Typography>
                                                <Paper className={classes.paper}
                                                       style={{backgroundColor: 'lightgrey'}}>
                                                    <Typography paragraph variant="h6"
                                                                gutterBottom>
                                                        Связаться с {house.name}
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        <a style={{textDecoration: 'none'}}
                                                           href={"tel:" + house.phone}>
                                                            {house.phone}
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
        </div>
    )
}