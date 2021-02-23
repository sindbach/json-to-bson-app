import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { LinearProgress } from '@material-ui/core';


const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
});

const theme = createMuiTheme({
  palette: {
    primary: green,
  }
});

function GreenLinearProgress(props) {
  const { classes } = props;
  return (
      <ThemeProvider theme={theme}>
        <LinearProgress color="primary" className={classes.margin}>
        </LinearProgress>
      </ThemeProvider>
  );
}

GreenLinearProgress.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GreenLinearProgress);