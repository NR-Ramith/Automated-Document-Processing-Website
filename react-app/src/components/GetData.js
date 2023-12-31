import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Icon from '@material-ui/core/Icon';
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from './axios-object';
import { setTemplateId, setDId, setStateValue, getTemplateId, setFieldValue, checkIfMandatoryField, setFilledMandatoryFieldIndicator, getAllFieldValues } from './values';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

class GetData extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      error: null,
      submitted: false,
      tid: null,
      image: null,
      labelWidth: 0,
    }
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    this.setState({ tid: getTemplateId() });
    axios.post('/prevTemplates/', JSON.stringify(localStorage.getItem("username")))
      .then(response => this.setState({ data: response.data }));

  }

  handleChange = (event) => {
    this.state.tid = event.target.value;
    setTemplateId(this.state.tid)
  }
  handleSubmit = (event) => {
    event.preventDefault();
    (this.state.tid === null) ? this.setState({ error: "Select A Valid Template" }) : this.setState({ submitted: true });
    let image = new FormData();
    image.append('image', this.state.image);
    axios.post('/submitform/' + this.state.tid, image).then((response) => {
      alert("Template Submitted Successfully");
      // this.context.router.history.push("/viewdata/"+this.state.tid+"/"+response.data.id);
      for(const field of Object.keys(response.data.fieldValues)){
        setFieldValue(field,response.data.fieldValues[field]);
        if(checkIfMandatoryField(field))
        setFilledMandatoryFieldIndicator(field, 1);
      }
      setDId(response.data.id);
      window.history.pushState({}, null, "/viewdata");
      window.dispatchEvent(new Event('popstate'));
    }).catch(_ => alert("Template Submission Failed"))
  }

  loadFile = (event) => {
    var image = document.getElementById('image');
    image.src = URL.createObjectURL(event.target.files[0]);
    this.setState({ image: event.target.files[0] });
    setStateValue("form-image", event.target.files[0]);
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h5">
              Get Data
            </Typography>
            <br />
            <form onSubmit={this.handleSubmit} className={classes.form}>
              <div className="form-group">
                <FormControl variant="outlined" className={classes.formControl} />
              </div>

              <input
                accept="image/*"
                className={classes.input}
                style={{ display: 'none' }}
                id="formimage"
                multiple
                type="file"
                onChange={this.loadFile}
              />
              <label htmlFor="formimage">
                <Button variant="contained" color="default" component="span" className={classes.button}>
                  Upload Form
                  <CloudUploadIcon className={classes.rightIcon} />
                </Button>
              </label>

              <img className="img-fluid" id="image" alt="" />

              {this.state.image != null && this.state.submitted === false &&
                <Button variant="contained" color="primary" className={classes.button} type="submit">
                  Send
                  <Icon className={classes.rightIcon}>send</Icon>
                </Button>}
              {this.state.submitted &&
                <div>
                  <CircularProgress className={classes.progress} />
                </div>
              }
            </form>
          </Paper>
        </CssBaseline>
      </main>
    )
  }
}

GetData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GetData);