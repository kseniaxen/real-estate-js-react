import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {
    Backdrop,
    Button, Fade, FormControl,
    Grid, InputLabel, MenuItem, Modal,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {clearError, setError, setLoading} from "../../../stores/CommonStore";
import {setCountries} from "../../../stores/CountryStore";
import {setCities, setSelectCountry} from "../../../stores/CityStore";
import {setTypes} from "../../../stores/TypeStore";
import {setTypeProperties} from "../../../stores/TypePropertyStore";
import {setCurrencies} from "../../../stores/CurrencyStore";
import {setUnits} from "../../../stores/UnitStore";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 400,
    },
    container: {
        marginTop:'10px'
    },
    text: {
        textAlign:'center'
    },
    button: {
        marginLeft:'10px'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    flexColumn: {
        display:'flex',
        flexDirection:'column'
    },
    select: {
        minWidth: 120
    }
}))

export default function Dashboard(){
    const commonStore = useSelector(state => state.CommonStore)
    const countryStore = useSelector(state => state.CountryStore)
    const cityStore = useSelector(state => state.CityStore)
    const typeStore = useSelector(state => state.TypeStore)
    const typePropertyStore = useSelector(state => state.TypePropertyStore)
    const currencyStore = useSelector(state => state.CurrencyStore)
    const unitStore = useSelector(state => state.UnitStore)
    const dispatch = useDispatch()

    const classes = useStyles();

    /**
     * Действия для страны: Добавить, Изменить и Удалить
     */

    const [openModalCountry, setOpenModalCountry] = useState(false);
    const [nameCountry, setNameCountry] = useState('')
    const [currentCountryId, setCurrentCountryId] = useState(null)
    const [showCountryError, setShowCountryError] = useState(false)
    const [errorCountryText, setErrorCountryText] = useState('')

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

    const handleNameCountryChange = (e) => {
        setNameCountry(e.target.value)
    }

    const handleCountryAdd = () => {
        setCurrentCountryId(null)
        setNameCountry('')
        setOpenModalCountry(true)
        setShowCountryError(false)
        setErrorCountryText('')
    }

    const handleCountryEdit = (e, countryId) => {
        setOpenModalCountry(true)
        setCurrentCountryId(countryId)
        setNameCountry(countryStore.countries.find((c) => c.id === countryId)?.name || '')
        setShowCountryError(false)
        setErrorCountryText('')
    }

    const handleCountryDelete = (e, countryId) => {
        setCurrentCountryId(countryId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/country/${countryId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.status
        }).then(status => {
            if(status === countryStore.HTTP_STATUS_NO_CONTENT){
                fetchCountries()
                setCurrentCountryId(null)
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleCountrySubmit = (e) => {
        e.preventDefault()
        if(!currentCountryId) {
            addCountry()
        } else {
            updateCountry()
        }
        setShowCountryError(false)
        setErrorCountryText('')
    }

    const addCountry = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/country`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameCountry})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response){
                if (response.status === 'success') {
                    fetchCountries()
                }else if (response.status === 'failure'){
                    setShowCountryError(true)
                    setErrorCountryText(response.data.name[0])
                }
            }
        }).catch((error) => {
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const updateCountry = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/country/${currentCountryId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameCountry})
        }).then((response) => {
            return response.json()
        }).then(response => {
            if (response) {
                if (response.status === 'success') {
                    fetchCountries()
                    setNameCountry('')
                    setCurrentCountryId(null)
                }else if(response.status === 'failure'){
                    setShowCountryError(true)
                    setErrorCountryText(response.data.name[0])
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    /**
     * Действия для города: Добавить, Изменить и Удалить
     */

    const [currentCityId, setCurrentCityId] = useState(null)
    const [nameCity, setNameCity] = useState('')
    const [openModalCity, setOpenModalCity] = useState(false)
    const [showCityError, setShowCityError] = useState(false)
    const [errorCityText, setErrorCityText] = useState('')

    const handleCountrySelectChange = (e) => {
        dispatch(setSelectCountry(e.target.value));
        fetchCitiesByCountryId(e.target.value)
    };

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

    const handleNameCityChange = (e) => {
        setNameCity(e.target.value)
    }

    const handleCityAdd = () => {
        setCurrentCityId(null)
        setNameCity('')
        setOpenModalCity(true)
        setShowCityError(false)
        setErrorCityText('')
    }

    const handleCityEdit = (e, cityId) => {
        setOpenModalCity(true)
        setCurrentCityId(cityId)
        setNameCity(cityStore.cities.find((c) => c.id === cityId)?.name || '')
        setShowCityError(false)
        setErrorCityText('')
    }

    const handleCityDelete = (e, cityId) => {
        setCurrentCityId(cityId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/city/${cityId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.status
        }).then(status => {
            if(status === cityStore.HTTP_STATUS_NO_CONTENT){
                fetchCitiesByCountryId(cityStore.selectCountry)
                setCurrentCityId(null)
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleCitySubmit = (e) => {
        e.preventDefault()
        if(!currentCityId) {
            addCity()
        } else {
            updateCity()
        }
        setShowCityError(false)
        setErrorCityText('')
    }

    const addCity = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/city`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameCity,'countryId':cityStore.selectCountry})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response){
                if (response.status === 'success') {
                    fetchCitiesByCountryId(cityStore.selectCountry)
                }else if (response.status === 'failure'){
                    if(response.data){
                        if(response.data.name){
                            setShowCityError(true)
                            setErrorCityText(response.data.name[0])
                        }
                        if(response.data.countryId){
                            setShowCityError(true)
                            setErrorCityText(response.data.countryId[0])
                        }
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

    const updateCity = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/city/${currentCityId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameCity,'countryId':cityStore.selectCountry})
        }).then((response) => {
            return response.json()
        }).then(response => {
            if (response) {
                if (response.status === 'success') {
                    fetchCitiesByCountryId(cityStore.selectCountry)
                    setNameCity('')
                    setCurrentCityId(null)
                }else if(response.status === 'failure'){
                    if(response.data){
                        if(response.data.name){
                            setShowCityError(true)
                            setErrorCityText(response.data.name[0])
                        }
                        if(response.data.countryId){
                            setShowCityError(true)
                            setErrorCityText(response.data.countryId[0])
                        }
                    }
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    /**
     * Действия для типа (продажа/аренда): Добавить, Изменить и Удалить
     */

    const [openModalType, setOpenModalType] = useState(false);
    const [nameType, setNameType] = useState('')
    const [currentTypeId, setCurrentTypeId] = useState(null)
    const [showTypeError, setShowTypeError] = useState(false)
    const [errorTypeText, setErrorTypeText] = useState('')

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

    const handleNameTypeChange = (e) => {
        setNameType(e.target.value)
    }

    const handleTypeAdd = () => {
        setCurrentTypeId(null)
        setNameType('')
        setOpenModalType(true)
        setShowTypeError(false)
        setErrorTypeText('')
    }

    const handleTypeEdit = (e, typeId) => {
        setOpenModalType(true)
        setCurrentTypeId(typeId)
        setNameType(typeStore.types.find((t) => t.id === typeId)?.name || '')
        setShowTypeError(false)
        setErrorTypeText('')
    }

    const handleTypeDelete = (e, typeId) => {
        setCurrentTypeId(typeId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/type/${typeId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.status
        }).then(status => {
            if(status === typeStore.HTTP_STATUS_NO_CONTENT){
                fetchTypes()
                setCurrentTypeId(null)
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleTypeSubmit = (e) => {
        e.preventDefault()
        if(!currentTypeId) {
            addType()
        } else {
            updateType()
        }
        setShowTypeError(false)
        setErrorTypeText('')
    }

    const addType = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/type`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameType})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response){
                if (response.status === 'success') {
                    fetchTypes()
                }else if (response.status === 'failure'){
                    if(response.data){
                       if(response.data.name){
                           setShowTypeError(true)
                           setErrorTypeText(response.data.name[0])
                       }
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

    const updateType = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/type/${currentTypeId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameType})
        }).then((response) => {
            return response.json()
        }).then(response => {
            if (response) {
                if (response.status === 'success') {
                    fetchTypes()
                    setNameType('')
                    setCurrentTypeId(null)
                }else if(response.status === 'failure'){
                    if(response.data){
                        if(response.data.name){
                            setShowTypeError(true)
                            setErrorTypeText(response.data.name[0])
                        }
                    }
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    /**
     * Действия для тип недвижимости: Добавить, Изменить и Удалить
     */

    const [openModalTypeProperty, setOpenModalTypeProperty] = useState(false);
    const [nameTypeProperty, setNameTypeProperty] = useState('')
    const [currentTypePropertyId, setCurrentTypePropertyId] = useState(null)
    const [showTypePropertyError, setShowTypePropertyError] = useState(false)
    const [errorTypePropertyText, setErrorTypePropertyText] = useState('')

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

    const handleNameTypePropertyChange = (e) => {
        setNameTypeProperty(e.target.value)
    }

    const handleTypePropertyAdd = () => {
        setCurrentTypePropertyId(null)
        setNameTypeProperty('')
        setOpenModalTypeProperty(true)
        setShowTypePropertyError(false)
        setErrorTypePropertyText('')
    }

    const handleTypePropertyEdit = (e, typeId) => {
        setOpenModalTypeProperty(true)
        setCurrentTypePropertyId(typeId)
        setNameTypeProperty(typePropertyStore.typeproperties.find((t) => t.id === typeId)?.name || '')
        setShowTypePropertyError(false)
        setErrorTypePropertyText('')
    }

    const handleTypePropertyDelete = (e, typeId) => {
        setCurrentTypePropertyId(typeId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/typeproperty/${typeId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.status
        }).then(status => {
            if(status === typePropertyStore.HTTP_STATUS_NO_CONTENT){
                fetchTypeProperties()
                setCurrentTypePropertyId(null)
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleTypePropertySubmit = (e) => {
        e.preventDefault()
        if(!currentTypePropertyId) {
            addTypeProperty()
        } else {
            updateTypeProperty()
        }
        setShowTypePropertyError(false)
        setErrorTypePropertyText('')
    }

    const addTypeProperty = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/typeproperty`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameTypeProperty})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response){
                if (response.status === 'success') {
                    fetchTypeProperties()
                }else if (response.status === 'failure'){
                    if(response.data){
                        if(response.data.name){
                            setShowTypePropertyError(true)
                            setErrorTypePropertyText(response.data.name[0])
                        }
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

    const updateTypeProperty = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/typeproperty/${currentTypePropertyId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameTypeProperty})
        }).then((response) => {
            return response.json()
        }).then(response => {
            if (response) {
                if (response.status === 'success') {
                    fetchTypeProperties()
                    setNameTypeProperty('')
                    setCurrentTypePropertyId(null)
                }else if(response.status === 'failure'){
                    setShowTypePropertyError(true)
                    setErrorTypePropertyText(response.data.name[0])
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    /**
     * Действия для валюты: Добавить, Изменить и Удалить
     */

    const [openModalCurrency, setOpenModalCurrency] = useState(false);
    const [nameCurrency, setNameCurrency] = useState('')
    const [currentCurrencyId, setCurrentCurrencyId] = useState(null)
    const [showCurrencyError, setShowCurrencyError] = useState(false)
    const [errorCurrencyText, setErrorCurrencyText] = useState('')

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

    const handleNameCurrencyChange = (e) => {
        setNameCurrency(e.target.value)
    }

    const handleCurrencyAdd = () => {
        setCurrentCurrencyId(null)
        setNameCurrency('')
        setOpenModalCurrency(true)
        setShowCurrencyError(false)
        setErrorCurrencyText('')
    }

    const handleCurrencyEdit = (e, currencyId) => {
        setOpenModalCurrency(true)
        setCurrentCurrencyId(currencyId)
        setNameCurrency(currencyStore.currencies.find((c) => c.id === currencyId)?.name || '')
        setShowCurrencyError(false)
        setErrorCurrencyText('')
    }

    const handleCurrencyDelete = (e, currencyId) => {
        setCurrentCurrencyId(currencyId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/currency/${currencyId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.status
        }).then(status => {
            if(status === currencyStore.HTTP_STATUS_NO_CONTENT){
                fetchCurrencies()
                setCurrentCurrencyId(null)
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleCurrencySubmit = (e) => {
        e.preventDefault()
        if(!currentCurrencyId) {
            addCurrency()
        } else {
            updateCurrency()
        }
        setShowCurrencyError(false)
        setErrorCurrencyText('')
    }

    const addCurrency = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/currency`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameCurrency})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response){
                if (response.status === 'success') {
                    fetchCurrencies()
                }else if (response.status === 'failure'){
                    if(response.data){
                        if(response.data.name){
                            setShowCurrencyError(true)
                            setErrorCurrencyText(response.data.name[0])
                        }
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

    const updateCurrency = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/currency/${currentCurrencyId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameCurrency})
        }).then((response) => {
            return response.json()
        }).then(response => {
            if (response) {
                if (response.status === 'success') {
                    fetchCurrencies()
                    setNameCurrency('')
                    setCurrentCurrencyId(null)
                }else if(response.status === 'failure'){
                    setShowCurrencyError(true)
                    setErrorCurrencyText(response.data.name[0])
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    /**
     * Действия для единиц измерения: Добавить, Изменить и Удалить
     */

    const [openModalUnit, setOpenModalUnit] = useState(false);
    const [nameUnit, setNameUnit] = useState('')
    const [currentUnitId, setCurrentUnitId] = useState(null)
    const [showUnitError, setShowUnitError] = useState(false)
    const [errorUnitText, setErrorUnitText] = useState('')

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

    const handleNameUnitChange = (e) => {
        setNameUnit(e.target.value)
    }

    const handleUnitAdd = () => {
        setCurrentUnitId(null)
        setNameUnit('')
        setOpenModalUnit(true)
        setShowUnitError(false)
        setErrorUnitText('')
    }

    const handleUnitEdit = (e, unitId) => {
        setOpenModalUnit(true)
        setCurrentUnitId(unitId)
        setNameUnit(unitStore.units.find((u) => u.id === unitId)?.name || '')
        setShowUnitError(false)
        setErrorUnitText('')
    }

    const handleUnitDelete = (e, unitId) => {
        setCurrentUnitId(unitId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/unit/${unitId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.status
        }).then(status => {
            if(status === unitStore.HTTP_STATUS_NO_CONTENT){
                fetchUnits()
                setCurrentUnitId(null)
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleUnitSubmit = (e) => {
        e.preventDefault()
        if(!currentUnitId) {
            addUnit()
        } else {
            updateUnit()
        }
        setShowUnitError(false)
        setErrorUnitText('')
    }

    const addUnit = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/unit`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameUnit})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response){
                if (response.status === 'success') {
                    fetchUnits()
                }else if (response.status === 'failure'){
                    if(response.data){
                        if(response.data.name){
                            setShowUnitError(true)
                            setErrorUnitText(response.data.name[0])
                        }
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

    const updateUnit = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/unit/${currentUnitId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': nameUnit})
        }).then((response) => {
            return response.json()
        }).then(response => {
            if (response) {
                if (response.status === 'success') {
                    fetchUnits()
                    setNameUnit('')
                    setCurrentUnitId(null)
                }else if(response.status === 'failure'){
                    setShowUnitError(true)
                    setErrorUnitText(response.data.name[0])
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
    }, [])

    return(
        <div>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                        <Typography variant="h5" className={classes.text}>Страны</Typography>
                        <div className={classes.container}>
                            <Button variant="contained" color="primary" onClick={handleCountryAdd}>
                                <AddIcon/>
                                Добавить
                            </Button>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Инд.</TableCell>
                                            <TableCell>Название</TableCell>
                                            <TableCell>Инструменты</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            countryStore.countries.map((country) => {
                                                return(
                                                    <TableRow key={country.name}>
                                                        <TableCell component="th" scope="row">
                                                            {country.id}
                                                        </TableCell>
                                                        <TableCell align="left">{country.name}</TableCell>
                                                        <TableCell align="left">
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    onClick={(e) => handleCountryEdit(e, country.id)}>
                                                                <EditIcon/>
                                                                Редактировать
                                                            </Button>
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    onClick={(e) => handleCountryDelete(e, country.id)}>
                                                                <DeleteIcon/>
                                                                Удалить
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                <Grid item xs={6}>
                        <Typography variant="h5" className={classes.text}>Города</Typography>
                        <div className={classes.container}>
                            <FormControl className={classes.select}>
                                <InputLabel id="name-city-label-input">Название</InputLabel>
                                <Select
                                    labelId="name-city-label-input"
                                    id="name-city-label"
                                    value={cityStore.selectCountry}
                                    onChange={handleCountrySelectChange}
                                >
                                    {
                                        countryStore.countries.map((country) => {
                                            return(
                                                <MenuItem value={country.id}>
                                                    {country.name}
                                                </MenuItem>
                                                )
                                            })
                                    }
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={handleCityAdd}>
                                <AddIcon/>
                                Добавить
                            </Button>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Инд.</TableCell>
                                            <TableCell>Название</TableCell>
                                            <TableCell>Инструменты</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            cityStore.cities.map((city) => {
                                                return(
                                                    <TableRow key={city.name}>
                                                        <TableCell component="th" scope="row">
                                                            {city.id}
                                                        </TableCell>
                                                        <TableCell align="left">{city.name}</TableCell>
                                                        <TableCell align="left">
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    onClick={(e) => handleCityEdit(e, city.id)}>
                                                                <EditIcon/>
                                                                Редактировать
                                                            </Button>
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    onClick={(e) => handleCityDelete(e, city.id)}>
                                                                <DeleteIcon/>
                                                                Удалить
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                <Grid item xs={6}>
                        <Typography variant="h5" className={classes.text}>Тип</Typography>
                        <div className={classes.container}>
                            <Button variant="contained" color="primary" onClick={handleTypeAdd}>
                                <AddIcon/>
                                Добавить
                            </Button>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Инд.</TableCell>
                                            <TableCell>Название</TableCell>
                                            <TableCell>Инструменты</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            typeStore.types.map((type) => {
                                                return(
                                                    <TableRow key={type.name}>
                                                        <TableCell component="th" scope="row">
                                                            {type.id}
                                                        </TableCell>
                                                        <TableCell align="left">{type.name}</TableCell>
                                                        <TableCell align="left">
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    onClick={(e) => handleTypeEdit(e, type.id)}>
                                                                <EditIcon/>
                                                                Редактировать
                                                            </Button>
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    onClick={(e) => handleTypeDelete(e, type.id)}>
                                                                <DeleteIcon/>
                                                                Удалить
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" className={classes.text}>Тип недвижимости</Typography>
                    <div className={classes.container}>
                        <Button variant="contained" color="primary" onClick={handleTypePropertyAdd}>
                            <AddIcon/>
                            Добавить
                        </Button>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Инд.</TableCell>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Инструменты</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        typePropertyStore.typeproperties.map((typeprop) => {
                                            return(
                                                <TableRow key={typeprop.name}>
                                                    <TableCell component="th" scope="row">
                                                        {typeprop.id}
                                                    </TableCell>
                                                    <TableCell align="left">{typeprop.name}</TableCell>
                                                    <TableCell align="left">
                                                        <Button variant="contained"
                                                                color="primary"
                                                                className={classes.button}
                                                                onClick={(e) => handleTypePropertyEdit(e, typeprop.id)}>
                                                            <EditIcon/>
                                                            Редактировать
                                                        </Button>
                                                        <Button variant="contained"
                                                                color="primary"
                                                                className={classes.button}
                                                                onClick={(e) => handleTypePropertyDelete(e, typeprop.id)}>
                                                            <DeleteIcon/>
                                                            Удалить
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" className={classes.text}>Валюты</Typography>
                    <div className={classes.container}>
                        <Button variant="contained" color="primary" onClick={handleCurrencyAdd}>
                            <AddIcon/>
                            Добавить
                        </Button>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Инд.</TableCell>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Инструменты</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        currencyStore.currencies.map((cur) => {
                                            return(
                                                <TableRow key={cur.name}>
                                                    <TableCell component="th" scope="row">
                                                        {cur.id}
                                                    </TableCell>
                                                    <TableCell align="left">{cur.name}</TableCell>
                                                    <TableCell align="left">
                                                        <Button variant="contained"
                                                                color="primary"
                                                                className={classes.button}
                                                                onClick={(e) => handleCurrencyEdit(e, cur.id)}>
                                                            <EditIcon/>
                                                            Редактировать
                                                        </Button>
                                                        <Button variant="contained"
                                                                color="primary"
                                                                className={classes.button}
                                                                onClick={(e) => handleCurrencyDelete(e, cur.id)}>
                                                            <DeleteIcon/>
                                                            Удалить
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" className={classes.text}>Единицы измерения</Typography>
                    <div className={classes.container}>
                        <Button variant="contained" color="primary" onClick={handleUnitAdd}>
                            <AddIcon/>
                            Добавить
                        </Button>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Инд.</TableCell>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Инструменты</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        unitStore.units.map((unit) => {
                                            return(
                                                <TableRow key={unit.name}>
                                                    <TableCell component="th" scope="row">
                                                        {unit.id}
                                                    </TableCell>
                                                    <TableCell align="left">{unit.name}</TableCell>
                                                    <TableCell align="left">
                                                        <Button variant="contained"
                                                                color="primary"
                                                                className={classes.button}
                                                                onClick={(e) => handleUnitEdit(e, unit.id)}>
                                                            <EditIcon/>
                                                            Редактировать
                                                        </Button>
                                                        <Button variant="contained"
                                                                color="primary"
                                                                className={classes.button}
                                                                onClick={(e) => handleUnitDelete(e, unit.id)}>
                                                            <DeleteIcon/>
                                                            Удалить
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
            </Grid>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={openModalCountry}
                onClose={() => {
                    setOpenModalCountry(false)
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalCountry}>
                    <div className={classes.paper}>
                        <Typography variant="h5">Добавить/Изменить страну</Typography>
                        <form autoComplete="off" className={classes.flexColumn}>
                            <TextField error={showCountryError}
                                       helperText={errorCountryText.length !== 0 ? errorCountryText : ''}
                                       id="countryName"
                                       label="Название"
                                       value={nameCountry}
                                       onChange={handleNameCountryChange} />
                            <Button variant="contained" color="primary" onClick={handleCountrySubmit} className={classes.container}>
                                Подтвердить
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={openModalCity}
                onClose={() => {
                    setOpenModalCity(false)
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalCity}>
                    <div className={classes.paper}>
                        <Typography variant="h5">Добавить/Изменить город</Typography>
                        <form autoComplete="off" className={classes.flexColumn}>
                            <TextField error={showCityError}
                                       helperText={errorCityText.length !== 0 ? errorCityText : ''}
                                       id="cityName"
                                       label="Название"
                                       value={nameCity}
                                       onChange={handleNameCityChange} />
                            <Button variant="contained" color="primary" onClick={handleCitySubmit} className={classes.container}>
                                Подтвердить
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={openModalType}
                onClose={() => {
                    setOpenModalType(false)
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalType}>
                    <div className={classes.paper}>
                        <Typography variant="h5">Добавить/Изменить тип</Typography>
                        <form autoComplete="off" className={classes.flexColumn}>
                            <TextField error={showTypeError}
                                       helperText={errorTypeText.length !== 0 ? errorTypeText : ''}
                                       id="typeName"
                                       label="Название"
                                       value={nameType}
                                       onChange={handleNameTypeChange} />
                            <Button variant="contained" color="primary" onClick={handleTypeSubmit} className={classes.container}>
                                Подтвердить
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={openModalTypeProperty}
                onClose={() => {
                    setOpenModalTypeProperty(false)
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalTypeProperty}>
                    <div className={classes.paper}>
                        <Typography variant="h5">Добавить/Изменить тип недвижимости</Typography>
                        <form autoComplete="off" className={classes.flexColumn}>
                            <TextField error={showTypePropertyError}
                                       helperText={errorTypePropertyText.length !== 0 ? errorTypePropertyText : ''}
                                       id="typepropertyName"
                                       label="Название"
                                       value={nameTypeProperty}
                                       onChange={handleNameTypePropertyChange} />
                            <Button variant="contained" color="primary" onClick={handleTypePropertySubmit} className={classes.container}>
                                Подтвердить
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={openModalCurrency}
                onClose={() => {
                    setOpenModalCurrency(false)
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalCurrency}>
                    <div className={classes.paper}>
                        <Typography variant="h5">Добавить/Изменить валюту</Typography>
                        <form autoComplete="off" className={classes.flexColumn}>
                            <TextField error={showCurrencyError}
                                       helperText={errorCurrencyText.length !== 0 ? errorCurrencyText : ''}
                                       id="currencyName"
                                       label="Название"
                                       value={nameCurrency}
                                       onChange={handleNameCurrencyChange} />
                            <Button variant="contained" color="primary" onClick={handleCurrencySubmit} className={classes.container}>
                                Подтвердить
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={openModalUnit}
                onClose={() => {
                    setOpenModalUnit(false)
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalUnit}>
                    <div className={classes.paper}>
                        <Typography variant="h5">Добавить/Изменить единицу измерения</Typography>
                        <form autoComplete="off" className={classes.flexColumn}>
                            <TextField error={showUnitError}
                                       helperText={errorUnitText.length !== 0 ? errorUnitText : ''}
                                       id="unitName"
                                       label="Название"
                                       value={nameUnit}
                                       onChange={handleNameUnitChange} />
                            <Button variant="contained" color="primary" onClick={handleUnitSubmit} className={classes.container}>
                                Подтвердить
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}