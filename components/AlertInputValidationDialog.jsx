import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = {
  root: {
    fontSize: '14px'
  },
};

function AlertInputValidationDialog(props) {
  const { classes } = props;
  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        className={classes.root}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <span className={classes.root}>
          {"ERROR"}
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" className={classes.root}>
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className={classes.root} onClick={props.handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AlertInputValidationDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(AlertInputValidationDialog);