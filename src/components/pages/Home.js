import React,{useState,useEffect} from 'react'
import house from '../images/house.jpg'
import {Container, Row, Col, Card, Button, Image} from "react-bootstrap";
import {useSelector} from "react-redux";


export default function Home(){
    const commonStore = useSelector(state => state.CommonStore)
    const [apartments, setApartments] = useState([]);

    const fetchLastFourAds = () => {
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

    useEffect(() => {
        fetchLastFourAds();
    }, []);



    return(
        <>
            {
                /*
                <img style={{'height':'500px'}}
                 className="d-block w-100"
                 src={house}
                 alt="Main img"
            />
                 */
            }

            <Image src={house} fluid />

            <Container style={{paddingTop:'10px'}}>
                <Row >
                    {
                        apartments.map(apartment => {
                            return(
                                <Col>
                                    <Card style = {{width :'17rem'}}>
                                        <Card.Img variant="top" src = {house}/>
                                        <Card.Body>
                                            <Card.Title>{apartment.title}</Card.Title>

                                            <Button variants ="primary">Learn more</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
        </>
    )
}