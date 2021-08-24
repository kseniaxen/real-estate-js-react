import React from 'react'
import {useSelector} from 'react-redux'
import {Container, Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';
import {Typography} from "@material-ui/core";

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
        textDecoration:"none"
    }
}))

export default function Navigation(){
    const routerStore = useSelector(state => state.RouterStore)
    const classes = useStyles();
    return(
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand className={classes.brand}>
                    <HomeIcon className={classes.icon}/>
                    <Typography variant="h5">
                        Real Estate
                    </Typography>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {
                            routerStore.routes.map(route => {
                                return (
                                    <NavLink
                                        className={classes.navlink}
                                        key={route.path}
                                        to={route.path}>
                                        {route.name}
                                    </NavLink>
                                )
                            })
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}