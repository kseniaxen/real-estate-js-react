import React,{useState,useEffect} from 'react'
import houseImg from '../images/house.jpg'
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Backdrop, CardContent, CardMedia, Fade, Modal, Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

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
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
}));

export default function Home(){
    const commonStore = useSelector(state => state.CommonStore)
    const [apartments, setApartments] = useState([]);
    const [houses, setHouses] = useState([]);

    const classes = useStyles();
    const [openModalApart, setOpenModalApart] = useState(false);
    const [openModalHouse, setOpenModalHouse] = useState(false);
    const [apartment, setApartment] = useState(null)
    const [house, setHouse] = useState(null)
    const [image, setImage] = useState("")
    const [openImage, setOpenImage] = useState(false)

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

    const handleCloseModalApart = () => {
        setOpenModalApart(false)
    }

    const handleOpenApartment = (e, apartment) => {
        setOpenModalApart(true)
        setApartment(apartment)
    }

    const handleCloseModalHouse = (e) => {
        setOpenModalHouse(false)
    }

    const handleOpenHouse = (e, house) => {
        setOpenModalHouse(true)
        setHouse(house)
    }

    const parseDate = (ms) => {
        let date = new Date(ms);
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
        };
        return date.toLocaleDateString('ru', options);
    }

    useEffect(() => {
        fetchLastFourApartments();
        fetchLastFourHouses()
    }, []);

    return(
        <>
            <Container style = {{marginTop:'20px',
                backgroundSize: 'cover',
                backgroundImage: `url(${houseImg})`,
                color:'white',
                paddingTop:'30px',
                paddingBottom:'30px',
                textShadow:'0px 0px 2px black , black 1px 1px 0'
            }} className="bg-light img-fluid fw-bold rounded-3">
                <div className="jumbotron">
                    <Typography variant="h1">Real Estate</Typography>
                    <Typography variant="h5">?????????? ????????????????????????</Typography>
                    <hr className="my-4"/>
                    <Typography variant="h6">?????????? ?????????????? ?? ?????????? ?????? ????????????/??????????????</Typography>
                </div>

            </Container>
            <Typography variant="h3">?????????????????? ????????????????????</Typography>
            <Container style={{paddingTop:'20px'}}>
                <Typography variant="h5">????????????????</Typography>
                <Row xs={1} sm={2} md={2} lg={4}>
                    {
                        apartments.map(apartment => {
                            return(
                                <Col>
                                    <Card style = {{marginTop:'10px'}}>
                                        <div style={{display:'flex', flexDirection:'row'}}>
                                            <AccessTimeIcon className={classes.icon}/>
                                            <h6 className={classes.h6}>{parseDate(apartment.created_at)}</h6>
                                        </div>
                                        <CardMedia
                                            className={classes.media}
                                            image={apartment.image}
                                            title="apartment"
                                            style={{cursor: 'pointer'}}
                                            onClick={ () => {
                                                setOpenImage(true)
                                                setImage(apartment.image)
                                                }
                                            }
                                        />
                                        <Card.Body>
                                            <Card.Title style={{marginLeft:'17px'}}>{apartment.type[0].name}</Card.Title>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item" style={{fontSize:'20px', fontWeight: 'bold', color:'green'}}>{apartment.price} {apartment.currency[0].name}</li>
                                                <li className="list-group-item">???????????? - {apartment.rooms}, {apartment.area} ??<sup>2</sup> </li>
                                                <li className="list-group-item">{apartment.floor}/{apartment.floors} ????????</li>
                                            </ul>
                                            <Button style={{marginLeft:'15px'}}
                                                    variants ="primary"
                                                    onClick={(e) => handleOpenApartment(e, apartment)}>
                                                ????????????????
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
                <Typography variant="h5">????????</Typography>
                <Row xs={1} sm={2} md={2} lg={4}>
                    {
                        houses.map(house => {
                            return(
                                <Col>
                                    <Card style = {{marginTop:'10px'}}>
                                        <div style={{display:'flex', flexDirection:'row'}}>
                                            <AccessTimeIcon className={classes.icon}/>
                                            <h6 className={classes.h6}>{parseDate(house.created_at)}</h6>
                                        </div>
                                        <CardMedia
                                            className={classes.media}
                                            image={house.image}
                                            title="house"
                                            style={{cursor: 'pointer'}}
                                            onClick={ () => {
                                                setOpenImage(true)
                                                setImage(house.image)
                                                }
                                            }
                                        />
                                        <Card.Body>
                                            <Card.Title style={{marginLeft:'16px'}}>{house.type[0].name}</Card.Title>
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item" style={{fontSize:'20px', fontWeight: 'bold', color:'green'}}>{house.price} {house.currency[0].name}</li>
                                                <li class="list-group-item">???????????? - {house.rooms}, {house.area} ??<sup>2</sup>, {house.land_area} {house.unit[0].title} </li>
                                                <li class="list-group-item">?????????????????? - {house.floors}</li>
                                            </ul>
                                            <Button variants ="primary"
                                                    style={{marginLeft:'15px'}}
                                                    onClick={(e) => handleOpenHouse(e, house)}>
                                                ????????????????
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
                {
                    openImage && (
                        <Lightbox mainSrc={image} onCloseRequest={() => setOpenImage(false)}/>
                    )
                }
            </Container>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModalApart}
                onClose={handleCloseModalApart}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalApart}>
                    <div className={classes.paper}>
                        {
                            (apartment!== null) ? (
                                <div>
                                    <Typography paragraph variant="h5" gutterBottom>
                                        {apartment.type[0].name}
                                    </Typography>
                                    <Typography paragraph>
                                        ???????????? - {apartment.rooms} &#8226; {apartment.floor} ???????? ???? {apartment.floors}
                                    </Typography>
                                    <Typography paragraph>
                                        ?????????????? {apartment.area} {(apartment.residential_area ? ` - ${apartment.residential_area}` : "")} {(apartment.kitchen_area ? ` - ${apartment.kitchen_area}` : "")} ??<sup>2</sup>
                                    </Typography>
                                    <Typography paragraph color="textSecondary">
                                        ????????????????
                                    </Typography>
                                    <Typography paragraph
                                                style={{wordWrap: "break-word", maxWidth:'300px'}}>
                                            {apartment.description}
                                    </Typography>
                                    <Paper className={classes.paper}
                                            style={{backgroundColor: 'lightgrey'}}>
                                        <Typography paragraph
                                                    variant="h6"
                                                    gutterBottom>
                                            ?????????????????? ?? {apartment.name}
                                        </Typography>
                                        <Typography variant="h6">
                                            <a style={{textDecoration: 'none'}}
                                               href={"tel:" + apartment.phone}>
                                                {apartment.phone}
                                            </a>
                                        </Typography>
                                    </Paper>
                                </div>
                            ):''
                        }
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModalHouse}
                onClose={handleCloseModalHouse}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalHouse}>
                    <div className={classes.paper}>
                        {
                            (house!== null) ? (
                                <div>
                                    <Typography paragraph>
                                        ???????????? - {house.rooms} &#8226; {house.floors} ????????
                                    </Typography>
                                    <Typography paragraph>
                                        ?????????????? {house.area} {(house.residential_area ? ` - ${house.residential_area} ` : "")} {(house.kitchen_area ? ` - ${house.kitchen_area}` : "")} ??<sup>2</sup>
                                    </Typography>
                                    <Typography paragraph>
                                        {house.land_area} {house.unit[0].name}
                                    </Typography>
                                    <Typography paragraph color="textSecondary">
                                        ????????????????
                                    </Typography>
                                    <Typography paragraph
                                                style={{wordWrap: "break-word", maxWidth:'300px'}}>
                                        {house.description}
                                    </Typography>
                                    <Paper className={classes.paper}
                                           style={{backgroundColor: 'lightgrey'}}>
                                        <Typography paragraph variant="h6"
                                                    gutterBottom>
                                            ?????????????????? ?? {house.name}
                                        </Typography>
                                        <Typography variant="h6">
                                            <a style={{textDecoration: 'none'}}
                                               href={"tel:" + house.phone}>
                                                {house.phone}
                                            </a>
                                        </Typography>
                                    </Paper>
                                </div>
                            ):''
                        }
                    </div>
                </Fade>
            </Modal>
        </>)
}