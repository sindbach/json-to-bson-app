import React, { Component } from "react";

import HollowButton from "./HollowButton";
import Button from '@material-ui/core/Button';
import { Grid, Paper } from '@material-ui/core';

import GreenLinearProgress from './GreenLinearProgress';

import { withStyles } from '@material-ui/core/styles';

import {split as SplitEditor} from 'react-ace';
import 'brace/ext/language_tools';

import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    minHeight: "300px",
  },
});

class FormContainer extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      showProgress: false, 
      output: "", 
      input: "",
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
  }

  componentDidMount() {
  }

  handleCodeChange(newValue){
    this.state.input = newValue[0];
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.state.showProgress = true; 
    this.setState(this.state);
    console.log(this.state.input);
    fetch("/.netlify/functions/simple", {
        method:'POST', 
        mode:'cors',
        cache:'no-cache',
        headers: {'Content-Type': 'application/json'}, 
        redirect:'follow', 
        body: this.state.input}
        ).then(response => {
          return response.json();
        }).then(result=>{
          this.state.output = result.output;
          this.state.showProgress = false;
          this.setState(this.state);
    }); 
  }

  handleClearForm(e) {
    e.preventDefault();
    this.state.output = ""
    this.state.input = "";
    this.setState(this.state);
  }

  render() {
    const { classes } = this.props;
    const resizeOnLoad = editor => {
      window.addEventListener('resize', () => {
      editor.resize();
     });
    };

    return (
      <div id="root">
      <form className="container-fluid" onSubmit={this.handleFormSubmit}>
        <div>

            <Paper className={classes.paper}>
            <SplitEditor
              onLoad={resizeOnLoad}
              mode="javascript"
              theme="github"
              name="input-code"
              orientation="beside"
              splits={2}
              onChange={this.handleCodeChange}
              wrapEnabled={true}
              width={ "100%" }
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={[this.state.input, this.state.output]}
              setOptions={{showLineNumbers: false, 
                           tabSize: 2, 
                           enableLiveAutocompletion: false, 
                           useWorker: false, 
                           behavioursEnabled: false}}
            />
            </Paper>    
        </div>
        <div id="progress">
          { this.state.showProgress ? <GreenLinearProgress/> : null}
        </div>        
        <div>
          <br/>
          <Grid container spacing={1}>
            <Grid item xs>
            <Button variant="contained" 
                    color="primary" 
                    onClick={this.handleFormSubmit}
            >
            Convert
            </Button>
            </Grid>
            <Grid item xs>
            <HollowButton
              onClick={this.handleClearForm}
              title={"Clear"}
            />{" "}
            </Grid>
          </Grid>
        </div>
      </form>
      </div>
    );
  }
}

export default withStyles(styles)(FormContainer);
