import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import PropTypes from "prop-types";
import CssBaseline from '@material-ui/core/CssBaseline';

import FormContainer from "./FormContainer";

const styles = theme => ({
  content: {
    padding: theme.spacing(1),
  },
  toolbar: theme.mixins.toolbar,
  typography: {
    fontSize:18,
  }
});

class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <main className={classes.content}>
          <div className={classes.toolbar} />
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