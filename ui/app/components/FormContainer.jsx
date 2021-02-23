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
      showResults: false,
      showShared: false,
      showProgress: false, 
      showURL: "",
      results: null, 
      newQuery: {
        explain: "",
        serverVersion: "",
      },
    };

    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
  }

  componentDidMount() {
    if (this.state.caseId){
      this.state.showProgress = true; 
      this.setState(this.state);

      var oid = encodeURIComponent(this.state.caseId);
      fetch(`http://127.0.0.1:8080/api/v1/getcase?oid=${oid}&type=query`, {
            method:'GET', 
            mode:'cors',
            cache:'no-cache',
            headers: {'Content-Type': 'application/json'}, 
            redirect:'follow'}
            ).then(response => {
              return response.json();
            }).then(result=>{
              console.log(result);
              this.state.newQuery.explain = result.msg.input.explain; 
              this.state.newQuery.serverVersion = result.msg.input.serverVersion;
              this.state.showResults = true; 
              this.state.results = result.msg.output;
              this.state.showProgress = false; 
              this.setState(this.state); 
        }); 
    }
  }

  handleTextArea(e) {
    let value = e.target.value;
    this.setState(
      prevState => ({
        newQuery: {
          ...prevState.newQuery,
          explain: value
        }
      }),
      () => null
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let queryData = this.state.newQuery;
    this.state.showProgress = true; 
    this.setState(this.state);

    fetch("http://127.0.0.1:8080/api/v1/queryexplain", {
        method:'POST', 
        mode:'cors',
        cache:'no-cache',
        headers: {'Content-Type': 'application/json'}, 
        redirect:'follow', 
        body: JSON.stringify(queryData)}
        ).then(response => {
          return response.json();
        }).then(data=>{
          this.state.showResults = true;
          this.state.results = data;
          this.state.showProgress = false;
          this.setState(this.state);

    }); 
  }

  handleClearForm(e) {
    e.preventDefault();
    this.state.results = null
    this.state.showResults = false;
    this.state.newQuery.explain = "";
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
              value={["{}", "{}"]}
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
            Transform
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
