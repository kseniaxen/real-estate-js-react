import React from 'react'
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {Typography, useScrollTrigger, Zoom} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import history from "../../history";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const useStyles = makeStyles((theme) => ({
   container:{
       backgroundColor:'#115293'
   },
    icon:{
        width:'30px',
        height:'30px',
        color:'white'
    },
    block:{
        display:"flex",
        flexDirection:"row",
        justifyContent:'space-between',
        padding:'10px 50px',
        [theme.breakpoints.down("xs")]: {
            flexDirection:"column",
            margin:'0px',
        }
    },
    navlink:{
        display: 'inline-block',
        textDecoration: 'none',
        color: 'white',
        '&:hover': {
            color:'#dc004e'
        }
    },
    button:{
        borderRadius: '30px',
        backgroundColor:'transparent',
        border:'2px solid white',
        color:'white',
        padding:'10px',
        fontSize:'15px',
        '&:hover': {
            backgroundColor:'#dc004e',
        }
    },
    arrow:{
        color:'white',
        height:'30px',
        width:'30px'
    },
    logo:{
        [theme.breakpoints.down("sm")]: {
            maxWidth:'200px'
        },
        [theme.breakpoints.down("xs")]:{
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    center:{
        [theme.breakpoints.down("xs")]:{
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
}));

function ScrollTop(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor"
        );

        if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation">
                {children}
            </div>
        </Zoom>
    );
}

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired
};


export default function Footer(){
    const routerStore = useSelector(state => state.RouterStore)

    const classes = useStyles();
    return(
        <div className={classes.container}>
            <div className={classes.block}>
                <div className={classes.logo}>
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <HomeIcon className={classes.icon}/>
                        <Typography variant="h5" style={{cursor:'pointer', color:'white'}} onClick={()=>history.push('/')}>
                            Real Estate
                        </Typography>
                    </div>
                    <p style={{color:'white'}}>
                        Поиск квартир и домов для аренды/продажи
                    </p>
                </div>
                <div style={{borderLeft:'2px solid white'}}/>
                <div className={classes.center}>
                    <ul style={{display:'flex', flexDirection:'column',  listStyle: 'none', padding:'0'}}>
                        {
                            routerStore.navRoutes.map(route => {
                                    return (
                                        <li>
                                            <NavLink
                                                className={classes.navlink}
                                                key={route.path}
                                                to={route.path}>
                                                {route.name}
                                            </NavLink>
                                        </li>
                                    )
                            })
                        }
                    </ul>
                </div>
                <div style={{borderLeft:'2px solid white'}}/>
                <div className={classes.center}>
                    <ScrollTop>
                        <button className={classes.button}>
                            Вернуться на верх
                            <ArrowUpwardIcon className={classes.arrow}/>
                        </button>
                    </ScrollTop>
                </div>
            </div>
        </div>
    )
}