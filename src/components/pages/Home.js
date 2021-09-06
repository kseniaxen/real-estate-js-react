import React,{useState,useEffect} from 'react'
import house from '../images/house.jpg'
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Backdrop, CardContent, Fade, Modal, Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
}));

export default function Home(){
    const commonStore = useSelector(state => state.CommonStore)
    const [apartments, setApartments] = useState([]);
    const [houses, setHouses] = useState([]);

    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false);
    const [descriptionApart, setDescriptionApart] = useState("")
    const [typeApart, setTypeApart] = useState("")
    const [roomsApart, setRoomsApart] = useState("")
    const [floorsApart, setFloorsApart] = useState("")
    const [floorApart, setFloorApart] = useState("")
    const [areaApart, setAreaApart] = useState("")
    const [residential_areaApart, setResidential_areaApart] = useState("")
    const [kitchen_areaApart, setKitchen_areaApart] = useState("")
    const [nameApart, setNameApart] = useState("")
    const [phoneApart, setPhoneApart] = useState("")

    const fetchLastFourApartments = () => {
        fetch(`${commonStore.basename}/apartment/last`
        ).then((response) => {
            return response.json()
        }).then(response => {
            if(response){
                if (response.status === 'success') {
                    setApartments(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(response.data)
                                .replace(/(%2E)/ig, "%20")
                        )))
                }
            }
        }).catch((error) => {
            throw error
        })
    }

    const fetchLastFourHouses = () => {
        fetch(`${commonStore.basename}/house/last`
        ).then((response) => {
            return response.json()
        }).then(response => {
            if(response){
                if (response.status === 'success') {
                    setHouses(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(response.data)
                                .replace(/(%2E)/ig, "%20")
                        )))
                }
            }
        }).catch((error) => {
            throw error
        })
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const handleOpenApartment = (e, id) => {
        setOpenModal(true)
        setDescriptionApart(apartments.find(apart => id === apart.id).description)
        setTypeApart(apartments.find(apart => id === apart.id).type[0].name)
        setRoomsApart(apartments.find(apart => id === apart.id).rooms)
        setFloorsApart(apartments.find(apart => id === apart.id).floors)
        setFloorApart(apartments.find(apart => id === apart.id).floor)
        setAreaApart(apartments.find(apart => id === apart.id).area)
        setResidential_areaApart(apartments.find(apart => id === apart.id).residential_area)
        setKitchen_areaApart(apartments.find(apart => id === apart.id).kitchen_area)
        setNameApart(apartments.find(apart => id === apart.id).name)
        setPhoneApart(apartments.find(apart => id === apart.id).phone)
    }

    useEffect(() => {
        fetchLastFourHouses()
        fetchLastFourApartments();
    }, []);

    return(
        <>
            <Container style = {{marginTop:'20px',
                backgroundSize: 'cover',
                backgroundImage: `url(${house})`,
                color:'white',
                paddingTop:'30px',
                paddingBottom:'30px',
                textShadow:'0px 0px 2px black , black 1px 1px 0'
            }} className="bg-light img-fluid fw-bold rounded-3">
                <div className="jumbotron">
                    <Typography variant="h1">Real Estate</Typography>
                    <Typography variant="h5">Поиск недвижимости</Typography>
                    <hr className="my-4"/>
                    <Typography variant="h6">Поиск квартир и домов для аренды/продажи</Typography>
                </div>

            </Container>
            <Typography variant="h3">Последние объявления</Typography>
            <Container style={{paddingTop:'20px'}}>
                <Typography variant="h5">Квартиры</Typography>
                <Row >
                    {
                        apartments.map(apartment => {
                            return(
                                <Col>
                                    <Card style = {{minWidth :'17rem' , marginTop:'10px'}}>
                                        <Card.Img variant="top" src = {apartment.image}/>
                                        <Card.Body>
                                            <Card.Title>{apartment.type[0].name}</Card.Title>
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item">{apartment.price} {apartment.currency[0].name}.</li>
                                                <li class="list-group-item">{apartment.rooms} комната, {apartment.area} м<sup>2</sup> </li>
                                                <li class="list-group-item">{apartment.floor}/{apartment.floors} этаж</li>
                                            </ul>
                                            <Button variants ="primary"
                                                    onClick={(e) => handleOpenApartment(e, apartment.id)}>
                                                Детально
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
            <Container style={{paddingTop:'20px'}}>
                <Typography variant="h5">Дома</Typography>
                <Row >
                    {
                        houses.map(house => {
                            return(
                                <Col>
                                    <Card style = {{minWidth :'17rem' , marginTop:'10px'}}>
                                        <Card.Img variant="top" src = {house.image}/>
                                        <Card.Body>
                                            <Card.Title>{house.type[0].name}</Card.Title>
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item">{house.price} {house.currency[0].name}</li>
                                                <li class="list-group-item">{house.rooms} комната, {house.area} м<sup>2</sup>, {house.land_area} {house.unit[0].title} </li>
                                                <li class="list-group-item">{house.floors} этаж</li>
                                            </ul>
                                            <Button variants ="primary">Детально</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
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
                    <div className={classes.paper}>
                        <Typography paragraph variant="h5" gutterBottom>
                            {typeApart}
                        </Typography>
                        <Typography paragraph>
                            Комнат
                            - {roomsApart} &#8226; {floorApart} этаж
                            из {floorsApart}
                        </Typography>
                        <Typography paragraph>
                            Площадь {areaApart} {(residential_areaApart ? ` - ${residential_areaApart}` : "")} {(kitchen_areaApart ? ` - ${kitchen_areaApart}` : "")} м<sup>2</sup>
                        </Typography>
                        <Typography paragraph color="textSecondary">
                            Описание
                        </Typography>
                        <Typography paragraph
                                    style={{wordWrap: "break-word"}}>
                            {descriptionApart}
                        </Typography>
                        <Paper className={classes.paper}
                               style={{backgroundColor: 'lightgrey'}}>
                            <Typography paragraph variant="h6"
                                        gutterBottom>
                                Связаться с {nameApart}
                            </Typography>
                            <Typography variant="h6">
                                <a style={{textDecoration: 'none'}}
                                   href={"tel:" + phoneApart}>
                                    {phoneApart}
                                </a>
                            </Typography>
                        </Paper>
                    </div>
                </Fade>
            </Modal>
        </>)
}