import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import PropTypes from "prop-types";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import FormContainer from "./FormContainer";
import TransformIcon from '@material-ui/icons/Transform';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  appbar: {
    backgroundColor: theme.palette.info.dark 
  },
  content: {
    padding: theme.spacing(1),
  },
  typography: {
    fontSize:16,
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
});


class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <CssBaseline />
            <AppBar position="static" className={classes.appbar}>
              <Toolbar>
                <TransformIcon className={classes.icon} />
                <Typography variant="h6" className={classes.title}>
                  JSON To BSON 
                </Typography>
              </Toolbar>
            </AppBar>
          <main className={classes.content}>
              <Paper className={classes.paper}>
              <Typography className={classes.typography} paragraph>
                This application converts JSON into Golang class mapping. Paste a JSON document and the equivalent Go code will be automatically generated. 
                The code output utilises <Link href="https://pkg.go.dev/go.mongodb.org/mongo-driver/bson">go.mongodb.org/mongo-driver/bson</Link>, 
                and is ideal to be used to read/write into <Link href="https://www.mongodb.com/">MongoDB</Link>. 
                <br/>
                The conversion is performed using Go module <Link href="https://github.com/sindbach/json-to-bson-go"> github.com/sindbach/json-to-bson-go</Link>.
              </Typography>
              </Paper>
          <FormContainer />
          <br/>
        </main>
        <br/>
        <br/>
      </div>
    )
  }
}

MainContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainContainer);