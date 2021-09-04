import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {setApartments, setHouses, setIsLoginFlag} from "../../stores/UserStore";
import {makeStyles} from "@material-ui/core/styles";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Backdrop,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Drawer,
    Fab, Fade,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem, Modal,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import Collapse from "@material-ui/core/Collapse";
import AddIcon from "@material-ui/icons/Add";
import {setSelectTypeProperty} from "../../stores/TypePropertyStore";
import {setSelectType} from "../../stores/TypeStore";
import {setSelectCountry} from "../../stores/CountryStore";
import {setCities, setSelectCity} from "../../stores/CityStore";
import {setSelectCurrency} from "../../stores/CurrencyStore";
import {setSelectUnit} from "../../stores/UnitStore";
import {Send} from "@material-ui/icons";
import Resizer from "react-image-file-resizer";


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
    center: {
        justify: 'center'
    },
    hiddenInput: {
        opacity: 0,
        height: 0
    },
    imageTextField:{
        display:'none'
    },
    paperModal: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}))

export default function User() {
    const START_PAGE = 1, END_PAGE=1000
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [showNameError, setShowNameError] = useState(false)
    const [errorNameText, setErrorNameText] = useState('')
    const [showEmailError, setShowEmailError] = useState(false)
    const [errorEmailText, setErrorEmailText] = useState('')

    const [openAccordionApart, setOpenAccordionApart] = useState(false);
    const [expanded, setExpanded] = useState({});

    const [openSidePanel, setOpenSidePanel] = useState(false)
    const [adTitle, setAdTitle] = useState('')
    const [adRooms, setAdRooms] = useState(null)
    const [adArea, setAdArea] = useState(null)
    const [adResidentArea, setAdResidentArea] = useState(null)
    const [adKitchenArea, setAdKitchenArea] = useState(null)
    const [adFloor, setAdFloor] = useState(null)
    const [adFloors, setAdFloors] = useState(null)
    const [adPrice, setAdPrice] = useState(null)
    const [adDescription, setAdDescription] = useState('')
    const [adContact, setAdContact] = useState('')
    const [adPhone, setAdPhone] = useState(null)
    const [adImage, setAdImage] = useState('')
    const [adLand, setAdLand] = useState(null)
    const [currentAdId, setCurrentAdId] = useState({})
    const [openModal, setOpenModal] = useState(false)

    const countryStore = useSelector(state => state.CountryStore)
    const cityStore = useSelector(state => state.CityStore)
    const typeStore = useSelector(state => state.TypeStore)
    const typePropertyStore = useSelector(state => state.TypePropertyStore)
    const currencyStore = useSelector(state => state.CurrencyStore)
    const unitStore = useSelector(state => state.UnitStore)

    const dispatch = useDispatch()
    const classes = useStyles();

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

    /**
     * Пользовательские квартиры и дома
     */

    const fetchUserApartments = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartmentuser`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
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
        fetch(`${commonStore.basename}/houseuser`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
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

    useEffect(() => {
        fetchUserApartments()
        fetchUserHouses()
    },[])

    const handleExpandClick = (id) => {
        setExpanded({[id]: !expanded[id]});
    };

    const handleAdAdd = () => {
        setCurrentAdId({name:typePropertyStore.selectTypeProperty, id:null})
        setOpenSidePanel(true);
        dispatch(setSelectTypeProperty(typePropertyStore.selectTypeProperty || ''))
        dispatch(setSelectType(null))
        dispatch(setSelectCountry(null))
        dispatch(setSelectCity(null))
        dispatch(setSelectCurrency(null))
        dispatch(setSelectUnit(null))
        setAdTitle('')
        setAdRooms(null)
        setAdArea(null)
        setAdResidentArea(null)
        setAdKitchenArea(null)
        setAdFloor(null)
        setAdFloors(null)
        setAdLand(null)
        setAdPrice(null)
        setAdDescription('')
        setAdContact('')
        setAdPhone(null)
        setAdImage('')
    }

    const handleAdEdit = (e, type, id) => {
        setCurrentAdId({name:type, id:id})
        setOpenSidePanel(true)
        if(type === 'Квартира'){
            dispatch(setSelectTypeProperty(type || ''))
            dispatch(setSelectType(userStore.apartments.find((t) => t.id === id)?.type[0].id || null))
            dispatch(setSelectCountry(userStore.apartments.find((c) => c.id === id)?.country[0].id || null))
            fetchCitiesByCountryId(userStore.apartments.find((c) => c.id === id)?.country[0].id)
            dispatch(setSelectCity(userStore.apartments.find((c) => c.id === id)?.cityId|| null))
            dispatch(setSelectCurrency(userStore.apartments.find((c) => c.id === id)?.currency[0].id || null))
            setAdTitle(userStore.apartments.find((c) => c.id === id)?.title || '')
            setAdRooms(userStore.apartments.find((c) => c.id === id)?.rooms || null)
            setAdArea(userStore.apartments.find((c) => c.id === id)?.area || null)
            setAdResidentArea(userStore.apartments.find((c) => c.id === id)?.residential_area || null)
            setAdKitchenArea(userStore.apartments.find((c) => c.id === id)?.kitchen_area || null)
            setAdFloor(userStore.apartments.find((c) => c.id === id)?.floor || null)
            setAdFloors(userStore.apartments.find((c) => c.id === id)?.floors || null)
            setAdPrice(userStore.apartments.find((c) => c.id === id)?.price || null)
            setAdDescription(userStore.apartments.find((c) => c.id === id)?.description || '')
            setAdContact(userStore.apartments.find((c) => c.id === id)?.name || '')
            setAdPhone(userStore.apartments.find((c) => c.id === id)?.phone || null)
            setAdImage(userStore.apartments.find((c) => c.id === id)?.image || '')
        }else{
            dispatch(setSelectTypeProperty(type || ''))
            dispatch(setSelectType(userStore.houses.find((t) => t.id === id)?.type[0].id || null))
            dispatch(setSelectCountry(userStore.houses.find((c) => c.id === id)?.country[0].id || null))
            fetchCitiesByCountryId(userStore.houses.find((c) => c.id === id)?.country[0].id)
            dispatch(setSelectCity(userStore.houses.find((c) => c.id === id)?.cityId|| null))
            dispatch(setSelectCurrency(userStore.houses.find((c) => c.id === id)?.currency[0].id || null))
            setAdTitle(userStore.houses.find((c) => c.id === id)?.title || '')
            setAdRooms(userStore.houses.find((c) => c.id === id)?.rooms || null)
            setAdArea(userStore.houses.find((c) => c.id === id)?.area || null)
            setAdResidentArea(userStore.houses.find((c) => c.id === id)?.residential_area || null)
            setAdKitchenArea(userStore.houses.find((c) => c.id === id)?.kitchen_area || null)
            setAdLand(userStore.houses.find((c) => c.id === id)?.land_area || null)
            dispatch(setSelectUnit(userStore.houses.find((c) => c.id === id)?.unit[0].id|| null))
            setAdFloors(userStore.houses.find((c) => c.id === id)?.floors || null)
            setAdPrice(userStore.houses.find((c) => c.id === id)?.price || null)
            setAdDescription(userStore.houses.find((c) => c.id === id)?.description || '')
            setAdContact(userStore.houses.find((c) => c.id === id)?.name || '')
            setAdPhone(userStore.houses.find((c) => c.id === id)?.phone || null)
            setAdImage(userStore.houses.find((c) => c.id === id)?.image || '')
        }

    }

    const handleAdDelete = (e, type, id) => {
        setCurrentAdId({name:type, id:id})
        if(type === 'Квартира'){
            dispatch(clearError())
            dispatch(setLoading(true))
            fetch(commonStore.basename + '/apartmentuser/' + id,{
                method: 'DELETE',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                if (response.status === userStore.HTTP_STATUS_NO_CONTENT) {
                    setCurrentAdId({})
                    fetchUserApartments()
                }
            }).catch((error) => {
                dispatch(setError(error.message))
                throw error
            })
            dispatch(setLoading(false))
        }else{
            dispatch(clearError())
            dispatch(setLoading(true))
            fetch(commonStore.basename + '/houseuser/' + id,{
                method: 'DELETE',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                if (response.status === userStore.HTTP_STATUS_NO_CONTENT) {
                    setCurrentAdId({})
                    fetchUserHouses()
                }
            }).catch((error) => {
                dispatch(setError(error.message))
                throw error
            })
            dispatch(setLoading(false))
        }

    }

    /**
     * Общие данные для создания нового объявления
     */

    const handleTypeSelectChange = (e) => {
        dispatch(setSelectType(e.target.value))
        document.getElementById('adTypeValidator')?.setAttribute('value', e.target.value)
    }

    const handleCountrySelectChange = (e) => {
        dispatch(setSelectCountry(e.target.value))
        fetchCitiesByCountryId(e.target.value)
        document.getElementById('adCountryValidator')?.setAttribute('value', e.target.value)
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

    const handleCitySelectChange = (e) => {
        dispatch(setSelectCity(e.target.value))
        document.getElementById('adCityValidator')?.setAttribute('value', e.target.value)
    }

    const handleTitleChange = (e) => {
        setAdTitle(e.target.value)
    }

    const handleRoomsChange = (e) => {
        setAdRooms(Number(e.target.value))
    }

    const handleAreaChange = (e) => {
        setAdArea(e.target.value)
    }

    const handleResidentAreaChange = (e) => {
        setAdResidentArea(e.target.value)
    }

    const handleKitchenAreaChange = (e) => {
        setAdKitchenArea(e.target.value)
    }

    const handleFloorChange = (e) => {
        setAdFloor(Number(e.target.value))
    }

    const handleFloorsChange = (e) => {
        if(e.target.value < adFloor){
            setAdFloors(adFloor)
        }else{
            setAdFloors(Number(e.target.value))
        }

    }

    const handlePriceChange = (e) => {
        setAdPrice(e.target.value)
    }

    const handleCurrencySelectChange = (e) => {
        dispatch(setSelectCurrency(e.target.value))
        document.getElementById('adCurrencyValidator')?.setAttribute('value', e.target.value)
    }

    const handleAdDescriptionChange = (e) => {
        setAdDescription(e.target.value)
    }

    const handleContactChange = (e) => {
        setAdContact(e.target.value)
    }

    const handlePhoneChange = (e) => {
        setAdPhone(Number(e.target.value))
    }

    const handleLandChange = (e) => {
        setAdLand(e.target.value)
    }

    const handleUnitSelectChange = (e) => {
        dispatch(setSelectUnit(e.target.value))
        document.getElementById('adUnitValidator')?.setAttribute('value', e.target.value)
    }

    const resizeFile = (file) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 749, 562, 'JPEG', 100, 0,
            uri => {
                resolve(uri);
            },
            'base64'
        )
    })

    const handleImageChange = (ev) => {
        const files = ev.currentTarget.files
        if (files) {
            const file = files[0]
            if(file) {
                resizeFile(file).then((image) => {
                    if (typeof image === 'string') {
                        setAdImage(image)
                    }
                })
            }
        }
    }

    useEffect(() => {
        document.getElementById('adImage')?.setAttribute('src', adImage)
    },[adImage])

    const handleSubmitForm = (e) => {
        e.preventDefault()
        setOpenSidePanel(false)
        if(typePropertyStore.selectTypeProperty === 'Квартира'){
            if(!currentAdId.id){
                addApartment()
            }else{
                editApartment()
            }
        }else{
            if(!currentAdId.id){
                addHouse()
            }else{
                editHouse()
            }
        }
    }

    const addApartment = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartmentuser`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'userId': userStore.user.id,
                'type_propertyId': typePropertyStore.typeproperties.find(type => type.name === typePropertyStore.selectTypeProperty).id,
                'typeId': typeStore.selectType,
                'countryId': countryStore.selectCountry,
                'cityId': cityStore.selectCity,
                'currencyId': currencyStore.selectCurrency,
                'rooms': adRooms,
                'area': adArea,
                'residential_area': adResidentArea,
                'kitchen_area': adKitchenArea,
                'floor': adFloor,
                'floors': adFloors,
                'price': adPrice,
                'description': adDescription,
                'title': adTitle,
                'name': adContact,
                'phone': adPhone,
                'image': adImage
            })
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    fetchUserApartments()
                }else{
                    setOpenModal(true)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const editApartment = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/apartmentuser/${currentAdId.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'userId': userStore.user.id,
                'type_propertyId': typePropertyStore.typeproperties.find(type => type.name === typePropertyStore.selectTypeProperty).id,
                'typeId': typeStore.selectType,
                'countryId': countryStore.selectCountry,
                'cityId': cityStore.selectCity,
                'currencyId': currencyStore.selectCurrency,
                'rooms': adRooms,
                'area': adArea,
                'residential_area': adResidentArea,
                'kitchen_area': adKitchenArea,
                'floor': adFloor,
                'floors': adFloors,
                'price': adPrice,
                'description': adDescription,
                'title': adTitle,
                'name': adContact,
                'phone': adPhone,
                'image': adImage
            })
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    fetchUserApartments()
                }else{
                    setOpenModal(true)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const addHouse = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/houseuser`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'userId': userStore.user.id,
                'type_propertyId': typePropertyStore.typeproperties.find(type => type.name === typePropertyStore.selectTypeProperty).id,
                'typeId': typeStore.selectType,
                'countryId': countryStore.selectCountry,
                'cityId': cityStore.selectCity,
                'currencyId': currencyStore.selectCurrency,
                'rooms': adRooms,
                'area': adArea,
                'residential_area': adResidentArea,
                'land_area': adLand,
                'unitId': unitStore.selectUnit,
                'kitchen_area': adKitchenArea,
                'floors': adFloors,
                'price': adPrice,
                'description': adDescription,
                'title': adTitle,
                'name': adContact,
                'phone': adPhone,
                'image': adImage
            })
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    fetchUserHouses()
                }else{
                    setOpenModal(true)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const editHouse = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/houseuser/${currentAdId.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'userId': userStore.user.id,
                'type_propertyId': typePropertyStore.typeproperties.find(type => type.name === typePropertyStore.selectTypeProperty).id,
                'typeId': typeStore.selectType,
                'countryId': countryStore.selectCountry,
                'cityId': cityStore.selectCity,
                'currencyId': currencyStore.selectCurrency,
                'rooms': adRooms,
                'area': adArea,
                'residential_area': adResidentArea,
                'land_area': adLand,
                'unitId': unitStore.selectUnit,
                'kitchen_area': adKitchenArea,
                'floors': adFloors,
                'price': adPrice,
                'description': adDescription,
                'title': adTitle,
                'name': adContact,
                'phone': adPhone,
                'image': adImage
            })
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if(responseModel){
                if (responseModel.status === 'success') {
                    fetchUserHouses()
                }else{
                    setOpenModal(true)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenSidePanel(open);
    }

    const handleChangeRadioType = (e) => {
        dispatch(setSelectTypeProperty(e.target.value))
    }

    return(
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={4}>
                    <Paper className={classes.paper}>
                        <div className={classes.flexRow}>
                            <AccountCircleIcon className={classes.icon}/>
                            <Typography variant="h5"
                                        className={classes.textNameUser}>{userStore.user.name}</Typography>
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
                            <Typography className={classes.textNameUser}>Аккаунт
                                создан: {parseDate(userStore.user.createdAt)}</Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                    <Typography variant="h5" style={{textAlign:'center'}}>Мои объявления</Typography>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.headingAccordion}>Квартиры</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                                                        <div>
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    onClick={(e) => handleAdEdit(e, apart.typeproperty[0].name, apart.id)}>
                                                                <EditIcon/>
                                                                Редактировать
                                                            </Button>
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    onClick={(e) => handleAdDelete(e, apart.typeproperty[0].name, apart.id)}>
                                                                <DeleteIcon/>
                                                                Удалить
                                                            </Button>
                                                        </div>
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
                                                                Площадь {apart.area} {(apart.residential_area ? ` - ${apart.residential_area}` : "")} {(apart.kitchen_area ? ` - ${apart.kitchen_area}` : "")}
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
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.headingAccordion}>Дома</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                                                        <div>
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    onClick={(e) => handleAdEdit(e, house.typeproperty[0].name, house.id)}>
                                                                <EditIcon/>
                                                                Редактировать
                                                            </Button>
                                                            <Button variant="contained"
                                                                    color="primary"
                                                                    onClick={(e) => handleAdDelete(e, house.typeproperty[0].name, house.id)}>
                                                                <DeleteIcon/>
                                                                Удалить
                                                            </Button>
                                                        </div>
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
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => handleAdAdd(typePropertyStore.selectTypeProperty)}>
                <AddIcon/>
            </Fab>
            <Drawer
                open={openSidePanel}
                onClose={toggleDrawer(false)}>
                <FormLabel component="legend">Тип недвижимости</FormLabel>
                <RadioGroup aria-label="type" name="type" value={typePropertyStore.selectTypeProperty}
                            onChange={handleChangeRadioType}>
                    <FormControlLabel value="Квартира" control={<Radio/>} label="Квартира"/>
                    <FormControlLabel value="Дом" control={<Radio/>} label="Дом"/>
                </RadioGroup>
                {
                    (typePropertyStore.selectTypeProperty === 'Квартира') ?
                        (
                            <form
                                onSubmit={handleSubmitForm}
                                onError={errors => console.log(errors)}>
                                <div className={classes.flexColumn}>
                                    <FormControl>
                                        <InputLabel shrink id="name-type-label-input">
                                            Тип объявления
                                        </InputLabel>
                                        <Select
                                            labelId="name-type-label-input"
                                            id="name-type-label"
                                            value={typeStore.selectType}
                                            onChange={handleTypeSelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                typeStore.types.map((type) => {
                                                    return (
                                                        <MenuItem value={type.id}>
                                                            {type.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adTypeValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={typeStore.selectType?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel shrink id="name-country-label-input">
                                            Страна
                                        </InputLabel>
                                        <Select
                                            labelId="name-country-label-input"
                                            id="name-country-label"
                                            value={countryStore.selectCountry}
                                            onChange={handleCountrySelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                countryStore.countries.map((country) => {
                                                    return (
                                                        <MenuItem value={country.id}>
                                                            {country.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adCountryValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={countryStore.selectCountry?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel shrink id="name-city-label-input">
                                            Город
                                        </InputLabel>
                                        <Select
                                            labelId="name-city-label-input"
                                            id="name-city-label"
                                            value={cityStore.selectCity}
                                            onChange={handleCitySelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                cityStore.cities.map((city) => {
                                                    return (
                                                        <MenuItem value={city.id}>
                                                            {city.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adCityValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={cityStore.selectCity?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id='title'
                                            name='title'
                                            label={'Название объявления'}
                                            value={adTitle}
                                            onChange={handleTitleChange}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="rooms"
                                            label={'Комнат'}
                                            type='number'
                                            inputProps={{'min': 1}}
                                            value={adRooms}
                                            required
                                            onChange={handleRoomsChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="area"
                                            label={'Площадь'}
                                            value={adArea}
                                            onChange={handleAreaChange}
                                            required
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="resArea"
                                            label={'Жилая'}
                                            value={adResidentArea}
                                            onChange={handleResidentAreaChange}
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="kitArea"
                                            label={'Кухня'}
                                            value={adKitchenArea}
                                            onChange={handleKitchenAreaChange}
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="floor"
                                            label={'Этаж'}
                                            type='number'
                                            inputProps={{'min': 1, 'max': 50}}
                                            value={adFloor}
                                            required
                                            onChange={handleFloorChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="floors"
                                            label={'Этажность'}
                                            type='number'
                                            inputProps={{'min': 1, 'max': 50}}
                                            value={adFloors}
                                            required
                                            onChange={handleFloorsChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="price"
                                            label={'Цена'}
                                            value={adPrice}
                                            onChange={handlePriceChange}
                                            required
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel shrink id="name-currency-label-input">
                                            Валюта
                                        </InputLabel>
                                        <Select
                                            labelId="name-currency-label-input"
                                            id="name-currency-label"
                                            value={currencyStore.selectCurrency}
                                            onChange={handleCurrencySelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                currencyStore.currencies.map((cur) => {
                                                    return (
                                                        <MenuItem value={cur.id}>
                                                            {cur.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adCurrencyValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={currencyStore.selectCurrency?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id='description'
                                            label={'Описание'}
                                            value={adDescription}
                                            onChange={handleAdDescriptionChange}
                                            multiline
                                            rows={1}
                                            rowsMax={5}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id='contact'
                                            name='contact'
                                            label={'Контактное лицо'}
                                            value={adContact}
                                            onChange={handleContactChange}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="phone"
                                            label={'Телефон'}
                                            value={adPhone}
                                            type='number'
                                            onChange={handlePhoneChange}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <div>
                                            <div>
                                                <img alt='adImage' id='adImage'/>
                                            </div>
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                >
                                                    <div>
                                                        Загрузить фото
                                                        <TextField
                                                            id="image"
                                                            type='file'
                                                            className={classes.imageTextField}
                                                            onChange={handleImageChange}
                                                        />
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormControl>
                                        <Button
                                            color='primary'
                                            type='submit'
                                        >
                                            Подтвердить
                                            <Send/>
                                        </Button>
                                    </FormControl>
                                </div>
                            </form>
                        ) :
                        (
                            <form
                                onSubmit={handleSubmitForm}
                                onError={errors => console.log(errors)}>
                                <div className={classes.flexColumn}>
                                    <FormControl>
                                        <InputLabel shrink id="name-type-label-input">
                                            Тип объявления
                                        </InputLabel>
                                        <Select
                                            labelId="name-type-label-input"
                                            id="name-type-label"
                                            value={typeStore.selectType}
                                            onChange={handleTypeSelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                typeStore.types.map((type) => {
                                                    return (
                                                        <MenuItem value={type.id}>
                                                            {type.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adTypeValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={typeStore.selectType?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel shrink id="name-country-label-input">
                                            Страна
                                        </InputLabel>
                                        <Select
                                            labelId="name-country-label-input"
                                            id="name-country-label"
                                            value={countryStore.selectCountry}
                                            onChange={handleCountrySelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                countryStore.countries.map((country) => {
                                                    return (
                                                        <MenuItem value={country.id}>
                                                            {country.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adCountryValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={countryStore.selectCountry?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel shrink id="name-city-label-input">
                                            Город
                                        </InputLabel>
                                        <Select
                                            labelId="name-city-label-input"
                                            id="name-city-label"
                                            value={cityStore.selectCity}
                                            onChange={handleCitySelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                cityStore.cities.map((city) => {
                                                    return (
                                                        <MenuItem value={city.id}>
                                                            {city.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adCityValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={cityStore.selectCity?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id='title'
                                            name='title'
                                            label={'Название объявления'}
                                            value={adTitle}
                                            onChange={handleTitleChange}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="rooms"
                                            label={'Комнат'}
                                            type='number'
                                            inputProps={{'min': 1}}
                                            value={adRooms}
                                            required
                                            onChange={handleRoomsChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="area"
                                            label={'Площадь'}
                                            value={adArea}
                                            onChange={handleAreaChange}
                                            required
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="resArea"
                                            label={'Жилая'}
                                            value={adResidentArea}
                                            onChange={handleResidentAreaChange}
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="kitArea"
                                            label={'Кухня'}
                                            value={adKitchenArea}
                                            onChange={handleKitchenAreaChange}
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="land"
                                            label={'Участок'}
                                            value={adLand}
                                            onChange={handleLandChange}
                                            required
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel shrink id="name-country-label-input">
                                            Единица измерения
                                        </InputLabel>
                                        <Select
                                            labelId="name-unit-label-input"
                                            id="name-unit-label"
                                            value={unitStore.selectUnit}
                                            onChange={handleUnitSelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                unitStore.units.map((unit) => {
                                                    return (
                                                        <MenuItem value={unit.id}>
                                                            {unit.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adUnitValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={unitStore.selectUnit?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="floors"
                                            label={'Этажность'}
                                            type='number'
                                            inputProps={{'min': 1, 'max': 50}}
                                            value={adFloors}
                                            required
                                            onChange={handleFloorsChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="price"
                                            label={'Цена'}
                                            value={adPrice}
                                            onChange={handlePriceChange}
                                            required
                                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel shrink id="name-currency-label-input">
                                            Валюта
                                        </InputLabel>
                                        <Select
                                            labelId="name-currency-label-input"
                                            id="name-currency-label"
                                            value={currencyStore.selectCurrency}
                                            onChange={handleCurrencySelectChange}
                                            style={{width: 250}}
                                        >
                                            {
                                                currencyStore.currencies.map((cur) => {
                                                    return (
                                                        <MenuItem value={cur.id}>
                                                            {cur.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <input
                                            id='adCurrencyValidator'
                                            tabIndex={-1}
                                            autoComplete="off"
                                            className={classes.hiddenInput}
                                            value={currencyStore.selectCurrency?.toString()}
                                            required={true}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id='description'
                                            label={'Описание'}
                                            value={adDescription}
                                            onChange={handleAdDescriptionChange}
                                            multiline
                                            rows={1}
                                            rowsMax={5}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id='contact'
                                            name='contact'
                                            label={'Контактное лицо'}
                                            value={adContact}
                                            onChange={handleContactChange}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="phone"
                                            label={'Телефон'}
                                            value={adPhone}
                                            type='number'
                                            onChange={handlePhoneChange}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <div>
                                            <div>
                                                <img alt='adImage' id='adImage'/>
                                            </div>
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                >
                                                    <div>
                                                        Загрузить фото
                                                        <TextField
                                                            id="image"
                                                            type='file'
                                                            className={classes.imageTextField}
                                                            onChange={handleImageChange}
                                                        />
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormControl>
                                        <Button
                                            color='primary'
                                            type='submit'
                                        >
                                            Подтвердить
                                            <Send/>
                                        </Button>
                                    </FormControl>
                                </div>
                            </form>
                        )
                }
            </Drawer>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <div className={classes.paperModal}>
                        <h2>Неверные данные</h2>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}