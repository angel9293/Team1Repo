import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Redirect } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import {
  Drawer, CssBaseline, AppBar, Toolbar, List, Typography,
  Divider, IconButton, ListItem, ListItemIcon, ListItemText,
  Link, Container, Grid, CardMedia, CardContent, CardActions,
  Card, Button
} from '@material-ui/core';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HistoryIcon from '@material-ui/icons/History';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  tDisplay: {
    fontSize: 15,
    margin: 15,
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "100%",
  },
  cardContent: {
    flexGrow: 1,
  },
  root: {
    display: "flex",
  },
  appBar: {
    height: 50,
    justifyContent: "center",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function LiveListings() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [listings, setListings] = useState([]);
  const [target, setTarget] = useState();// target will be item that will be deleted
  
  const handleDrawerOpen = () => {// function opens the side drawer
    setOpen(true);
  };

  const handleDrawerClose = () => {// function closes the side drawer
    setOpen(false);
  };

  useEffect(() => {// function gets all the listings for the user (live only)
    axios.post("http://localhost:4000/listings/filter", {username: localStorage.getItem("username"), sold:false})
      .then(response => {
        setIsLoaded(true);
        setListings([]);
        setListings(response.data);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, [])

  const deleteItem = (itemID) => {// function deletes an individual item
    console.log("you are trying to delete item#: ", itemID);
    axios.delete("http://localhost:4000/listings/" + itemID)
      .then(response => {
        //setReply(response.data);
        console.log("Success", response);
        window.location = "http://localhost:3000/live-listings";
      },
      (error) => {
        setError(error);
      }
    );
  };

  const displayListings = () => {// function maps a display template to each listed item
    return(
      <Container maxWidth="md" className={classes.cardGrid}>
        <Grid container spacing={4}>
          {listings.map(item => (
            <Grid item key={listings} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={item.image}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                  </Typography>
                  <Typography>
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" href={"/edit-page/" + item._id} size="medium" color="primary">
                    EDIT
                  </Button>
                  <Button variant="contained" size="medium" color="secondary" onClick={ () => {deleteItem(item._id)} }>
                    DELETE
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  };

  if(localStorage.getItem("auth-token") !== ""){// check if user logged in
    if(error){// handling errors
      return <div>Error: {error.message}</div>;
    }
    else if(!isLoaded){// waiting for setup
      return <div>Loading...</div>;
    }
    else{// rendering main display
      return(
        <div>
          <div className={classes.root}>
            <CssBaseline/>
            <AppBar
            position="relative"
            className={clsx(classes.appBar, {[classes.appBarShift]: open,})}
            >
              <Toolbar>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
                >
                  <MenuIcon/>
                </IconButton>
                <Typography variant="h6" noWrap>
                  {localStorage.getItem("username")}'s LIVE Items!
                </Typography>
              </Toolbar>
            </AppBar>
          </div>
          <div>
            <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{paper: classes.drawerPaper,}}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
              </div>
              <Divider/>
              <List>
                {[
                  {link: "#", text: "Live Listings", index: 0},
                  {link: "http://localhost:3000/sold-listings", text: "Sold Listings", index: 1},
                  {link: "http://localhost:3000/order-history", text: "Order History", index: 2},
                  {link: "http://localhost:3000/wishlist", text: "Wishlist", index: 3},
                  {link: "http://localhost:3000/messages-page/"+localStorage.getItem("username"), text: "Messages", index: 4},
                  {link: "http://localhost:3000/user-settings", text: "Settings", index: 5},
                ].map((obj) => (
                  <Link href={obj.link}>
                    <ListItem button key={obj.text}>
                      <ListItemIcon>
                        {obj.index === 0 && <MoneyOffIcon/>}
                        {obj.index === 1 && <MonetizationOnIcon/>}
                        {obj.index === 2 && <HistoryIcon/>}
                        {obj.index === 3 && <StarIcon/>}
                        {obj.index === 4 && <MailIcon/>}
                        {obj.index === 5 && <SettingsIcon/>}
                      </ListItemIcon>
                      <ListItemText primary={obj.text}/>
                    </ListItem>
                  </Link>
                ))}
              </List>
              <Divider/>
            </Drawer>
          </div>
          <main className={clsx(classes.content, {[classes.contentShift]: open,})}>
            <div className={classes.drawerHeader}/>
            <Typography paragraph>
              {displayListings()}
            </Typography>
          </main>
        </div>
      );
    }
  }
  else{// if user isnt logged in, they get redirected to login
    return(
        <Redirect to="/login"/>
    );
  }
}