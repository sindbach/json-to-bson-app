import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import PropTypes from "prop-types";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import FormContainer from "./FormContainer";
import TransformIcon from '@material-ui/icons/Transform';

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
    fontSize:18,
  },
  title: {
    flexGrow: 1,
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
          <br/><br/>
          <main className={classes.content}>
          <Typography className={classes.typography} paragraph>
            Convert JSON to Go BSON Class Maps.
          </Typography>
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