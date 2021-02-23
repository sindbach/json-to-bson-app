import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
});

function HollowButton(props) {
  const { classes } = props;

  return (
      <Button variant="outlined" 
              className={classes.button}
              onClick={props.onClick}
              style={{ fontSize: 14}}
      >
      {props.title}
      </Button>
  );
}

HollowButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HollowButton);