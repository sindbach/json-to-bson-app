import React, { Component } from "react";

import { Grid, Paper, Button, TextField, Switch, 
         FormLabel, FormControlLabel, IconButton } from '@material-ui/core';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import ReplayRoundedIcon from '@material-ui/icons/ReplayRounded';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { withStyles } from '@material-ui/core/styles';

import Progress from './ProgressBar';
import AlertInputValidationDialog from "./AlertInputValidationDialog";

import AceEditor from 'react-ace';
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
  button: {
    marginRight: theme.spacing(1),
  }
});

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class FormContainer extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      showProgress: false, 
      extjson: false, 
      minIntSize: true,
      truncateInt: false,
      topname: "AutoGen",
      output: `package main

type AutoGen struct {
  Foo string \`bson:"foo"\`
}`, 
      content: `{
  "foo": "bar"
}`,
      openAlert: false,
      openValidationAlert: false,
      msgValidationAlert: "",
      sessionId: Date.now()
    };

    this.handleSwitchExtJSON = this.handleSwitchExtJSON.bind(this);
    this.handleSwitchMinInt = this.handleSwitchMinInt.bind(this);
    this.handleSwitchTruncInt = this.handleSwitchTruncInt.bind(this);
    this.handleAlertClick = this.handleAlertClick.bind(this); 
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
    this.handleTextFieldTopName = this.handleTextFieldTopName.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleValidationAlertClose = this.handleValidationAlertClose.bind(this); 
    this.handleValidationAlertOpen = this.handleValidationAlertOpen.bind(this); 
    this.createRecord = this.createRecord.bind(this);
  }

  componentDidMount() {
    this.createRecord({"type":"view"});
  }

  handleValidationAlertOpen(msg) {
    this.state.openValidationAlert = true;
    this.state.msgValidationAlert = msg;
    this.state.showProgress = false; 
    this.setState(this.state);
  }
  
  handleValidationAlertClose() {
    this.state.openValidationAlert = false;
    this.setState(this.state);
  }

  handleAlertClick = () => {
    this.state.openAlert = true;
    this.setState(this.state);
  };

  handleAlertClose = (event, reason) => {
    this.state.openAlert = false; 
    this.setState(this.state); 
  };

  handleSwitchExtJSON(e){
    this.state.extjson = !this.state.extjson; 
    this.setState(this.state);
  }

  handleSwitchMinInt(e){
    this.state.minIntSize = !this.state.minIntSize; 
    this.setState(this.state);
  }

  handleSwitchTruncInt(e){
    this.state.truncateInt = !this.state.truncateInt; 
    this.setState(this.state);
  }

  handleTextFieldTopName(e) {
    this.state.topname = e.target.value; 
    this.setState(this.state);
  }

  handleCodeChange(newValue){
    this.state.content = newValue;
  }

  createRecord(data){
    var record = data; 
    record.sessionId = this.state.sessionId;
    fetch("https://webhooks.mongodb-realm.com/api/client/v2.0/app/json-to-bson-metrics-hozoa/service/record/incoming_webhook/createRecord", {
      method:'POST', 
      mode:'cors',
      cache:'no-cache',
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(record)}
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.state.showProgress = true; 
    this.setState(this.state);
    var content = "{}";
    try{
      content = JSON.parse(this.state.content);
    } catch(e) {
      this.handleValidationAlertOpen(
        "Please make sure the JSON document is in valid JSON format. You can use JSON formatting tool such as https://jsonlint.com/ to help with the formatting"
      );
      return;
    }
    if (this.state.topname === ""){
      this.state.topname = "AutoGen";
    }
    var param = {
      "content": content, 
      "extjson": this.state.extjson, 
      "minintsize": this.state.minIntSize,
      "truncateint": this.state.truncateInt,
      "topname": this.state.topname,
    };
    fetch("/.netlify/functions/convert", {
        method:'POST', 
        mode:'cors',
        cache:'no-cache',
        headers: {'Content-Type': 'application/json'}, 
        redirect:'follow', 
        body: JSON.stringify(param)}
        ).then(response => {
          if (response.status!==200) {
            this.handleValidationAlertOpen(
              "Failed to reach the processing server"
            );
            return {"internalError":true};
          }
          return response.json();
        }).then(result=>{
          if (result.internalError === true ) {
            return;
          }
          console.log(result);
          if (result.errorMessage !== "") {
            this.handleValidationAlertOpen(
              "Module Error: " + result.errorMessage
            );
          } else {
            this.state.output = result.output;
            this.state.showProgress = false;
            this.setState(this.state);
          }
    }); 
    this.createRecord(param);
  }

  handleCopyClipboard(e){
    e.preventDefault();
    navigator.clipboard.writeText(this.state.output);
    this.handleAlertClick(); 
  }

  handleClearForm(e) {
    e.preventDefault();
    this.state.output = ""
    this.state.content = "";
    this.setState(this.state);
  }

  render() {
    const { classes } = this.props;
    return (
      <div id="root">
      <form className="container-fluid" onSubmit={this.handleFormSubmit}>
        <div>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <Paper className={classes.paper}>
                <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Struct Name</Typography>
                          Specifies the top level name of the auto generated struct
                        </React.Fragment>
                      }
                      placement="right"
                    >
                  <TextField
                      id="filled-topname"
                      label="Struct Name"
                      value={this.state.topname}
                      variant="outlined"
                      onChange={this.handleTextFieldTopName}
                    />
                  </HtmlTooltip>
                  <br/><br/>
                  <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Extended JSON</Typography>
                          Specifies whether the JSON document input contains Extended JSON format. i.e. <b>$oid</b>
                        </React.Fragment>
                      }
                      placement="right"
                    >
                  <FormControlLabel
                    value="extJSON"
                    control={<Switch 
                              color="primary" 
                              onClick={this.handleSwitchExtJSON}
                              checked={this.state.extjson}
                            />}
                    label="ExtJSON"
                    labelPlacement="end"
                  />
                  </HtmlTooltip>
                  <br/>
                  <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Minimize Integer Size</Typography>
                          Specifies how JSON numbers should be represented in Go types.

                          If <b>disabled</b>, numbers in JSON input will always be represented as <b>float64</b> in structs.
                          If <b>enabled</b>, JSON numbers will be represented using either <b>int32, int64, float32, or float64</b>. For example, the JSON field
                          "x: 100" would be converted to the struct field "X int32" while "x: 2^32 + 10" would be converted to "X int64"
                          because (2^32 + 10) overflows int32.
                        </React.Fragment>
                      }
                      placement="right"
                    >
                  <FormControlLabel
                    value="minIntSize"
                    control={<Switch 
                              color="primary" 
                              onClick={this.handleSwitchMinInt}
                              checked={this.state.minIntSize}
                            />}
                    label="Minimize Int"
                    labelPlacement="end"
                  />
                  </HtmlTooltip>
                  <br/>
                  <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Truncate Integers</Typography>
                          Specifies whether or not integer fields in generated structs should have the "truncate" BSON
                          struct tag. This tag enables non-integer data to be decoded into the integer field at the risk of loss of precision.

                          For example, if this option is <b>enabled</b> and MinimizeInteger is <b>enabled</b>, the JSON field "x: 1.0" would be converted to
                          struct field "X int32 `bson:"x,truncate"`", which would allow data like "x: 5.4" to be decoded into the struct.

                          This option is a no-op if MinimizeInteger is disabled is also called because in that case, all numeric JSON fields
                          are converted to float64 and the "truncate" tag is not meaningful for that type.
                        </React.Fragment>
                      }
                      placement="right"
                    >
                  <FormControlLabel
                    value="truncateInt"
                    control={<Switch 
                              color="primary" 
                              onClick={this.handleSwitchTruncInt}
                              checked={this.state.truncateInt}
                            />}
                    label="Truncate Int"
                    labelPlacement="end"
                  />
                  </HtmlTooltip>
                  <br/>
                  <div id="progress">
                    { this.state.showProgress ? <Progress/> : null}
                  </div>    
                  <br/>
                  <Button variant="contained"
                          color="primary"
                          onClick={this.handleFormSubmit}
                          className={classes.button}
                  >
                  Convert
                  </Button>
                </Paper>    
              </Grid>

              <Grid item xs>
                <FormLabel>JSON</FormLabel>
                <Tooltip title="Clear" placement="right">
                  <IconButton color="primary" 
                              aria-label="Clear Input" 
                              component="span"
                              onClick={this.handleClearForm}>
                    <ReplayRoundedIcon />
                  </IconButton>
                </Tooltip>
                <AceEditor
                  mode="javascript"
                  theme="github"
                  name="input-code"
                  placeholder="Insert JSON document here. i.e. {&quot;foo&quot; : &quot;bar&quot; }"
                  onChange={this.handleCodeChange}
                  wrapEnabled={true}
                  width={ "100%" }
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.state.content}
                  setOptions={{showLineNumbers: true, 
                              tabSize: 2, 
                              enableLiveAutocompletion: false, 
                              useWorker: false, 
                              behavioursEnabled: false}}
                />
              </Grid>
              <Grid item xs>
                <FormLabel>Go BSON</FormLabel>
                <Tooltip title="Copy To Clipboard" placement="right">
                  <IconButton color="primary" 
                              aria-label="Copy To Clipboard" 
                              component="span"
                              onClick={this.handleCopyClipboard}
                              >
                    <FileCopyRoundedIcon />
                  </IconButton>
                </Tooltip>
                <AceEditor
                  mode="golang"
                  theme="github"
                  name="output-code"
                  wrapEnabled={true}
                  width={ "100%" }
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.state.output}
                  setOptions={{showLineNumbers: true, 
                              tabSize: 2, 
                              enableLiveAutocompletion: false, 
                              useWorker: false, 
                              readOnly: true,
                              behavioursEnabled: false}}
                />
              </Grid>
            </Grid>
              <AlertInputValidationDialog
                  handleClose={this.handleValidationAlertClose}
                  open={this.state.openValidationAlert}
                  message={this.state.msgValidationAlert}
              />
              <Snackbar open={this.state.openAlert} 
                        autoHideDuration={3000} 
                        onClose={this.handleAlertClose}
              >
                <Alert onClose={this.handleAlertClose} severity="info">
                  Copied to Clipboard!
                </Alert>
              </Snackbar>
        </div>
      </form>
      </div>
    );
  }
}

export default withStyles(styles)(FormContainer);
