import React from 'react'
import {useSelector} from 'react-redux'
import {Container, Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';
import {Button, Typography} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import history from "../../history";

const useStyles = makeStyles((theme) => ({
    brand:{
        display:'flex'
    },
    icon:{
        width:'30px',
        height:'30px'
    },
    navlink:{
        marginLeft: '20px',
        color:"white",
        textDecoration:"none",
        '&:hover': {
            color:'#e33371'
        }
    }
}))

export default function Navigation(){
    const routerStore = useSelector(state => state.RouterStore)
    const userStore = useSelector(state => state.UserStore)
    const classes = useStyles();
    return(
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand className={classes.brand}>
                    <HomeIcon className={classes.icon}/>
                    <Typography variant="h5" style={{cursor:'pointer'}} onClick={()=>history.push('/')}>
                        Real Estate
                    </Typography>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {
                            routerStore.routes.map(route => {
                                if(!/^Пользователь/.test(route.name)){
                                    return (
                                        <NavLink
                                            className={classes.navlink}
                                            key={route.path}
                                            to={route.path}>
                                            {route.name}
                                        </NavLink>
                                    )
                                }
                            })
                        }
                    </Nav>
                </Navbar.Collapse>
                {
                    userStore.user && (
                            <Button onClick={() => history.push('/user')}
                                    variant="contained"
                                    color="secondary">
                                <PersonIcon/> Личный кабинет
                            </Button>
                    )
                }
            </Container>
        </Navbar>
    );
}