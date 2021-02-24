import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';


const styles = theme => ({
  progress: {
    margin: theme.spacing(1),
  },
});

function Progress(props) {
  const { classes } = props;
  return (
      <LinearProgress className={classes.progress}></LinearProgress>
  );
}

Progress.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Progress);