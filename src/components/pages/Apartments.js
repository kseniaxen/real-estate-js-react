import React, {useEffect, useState} from 'react'
import {Button, Card, CardActions, CardContent, CircularProgress, Grid, Typography} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {setApartments, setCountApartment, setEnd, setStart} from "../../stores/ApartmentStore";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function Apartments(){
    const FETCH_DATA_COUNT = 4
    const commonStore = useSelector(state => state.CommonStore)
    const apartmentStore = useSelector(state => state.ApartmentStore)
    const classes = useStyles();
    const dispatch = useDispatch()

    const [hasMore, setHasMore] = useState(true)
    const [apartments, setApartments] = useState([])

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
                    /*
                    dispatch(setApartments(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(response.data)
                                .replace(/(%2E)/ig, "%20")
                        )
                    )))
                     */
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
        fetchCountApartments()
        fetchApartments(apartmentStore.start, apartmentStore.end)
    },[])

    return(
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                    <InfiniteScroll
                        next={fetchMoreApartments}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        dataLength={apartments.length}>
                        {
                            apartments.map(apart => {
                                return <Card className={classes.root}>
                                    <CardContent>
                                        <Typography className={classes.title} color="textSecondary"
                                                    gutterBottom>
                                            {apart.title}
                                        </Typography>
                                        <Typography variant="h5" component="h2">

                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            adjective
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            well meaning and kindly.
                                            <br/>
                                            {'"a benevolent smile"'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Learn More</Button>
                                    </CardActions>
                                </Card>
                            })
                        }
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </div>
    )
}