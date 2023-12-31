import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from './axios-object';
import { getTemplateId, getDId, getStateValue } from './values';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  finalpaper: {
    // padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    position: "relative",
    display: "inline-block"
  },
  image: {
    width: '100%',
  }
});

class ViewData extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      tid: null,
      did: null,
      templateURL: null,
      formImageURL: null,
    }
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    let tid = getTemplateId();
    let did = getDId();
    this.setState({ tid: tid, did: did });

    const url = window.URL.createObjectURL(new Blob([getStateValue("form-image")]));
    this.setState({ formImageURL: url });

    // Make a request to fetch the file data
    axios.get('/getTemplateFile/' + tid, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Set the URL to a state variable
        this.setState({ templateURL: url });
      });

    axios.get('/showMarked/' + tid + '/' + did)
      .then(response => this.setState({ data: response.data }));
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container wrap="nowrap" spacing={24}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <img src={this.state.formImageURL} className={classes.image} alt='' />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.finalpaper}>
              <img src={this.state.templateURL} className={classes.image} alt='' />

              {this.state.data.map(function (field, key) {
                return (
                  <div>
                    {Object.keys(field).map(data => {
                      const st2 = {
                        location: {
                          position: "absolute",
                          margin: "0 auto",
                          color: "black",
                          letterSpacing: "0.2em",
                          left: field[data]["lx"] + 0.35 + "%",
                          top: field[data]["ty"] + "%",
                        }
                      }
                      if (field[data]["type"].slice(0,4) === "Text") {
                        return (
                          <strong><div style={st2.location}>{data}</div></strong>
                        )
                      }
                      else if (field[data]["type"] === "Signature") {
                        if (data instanceof Blob) {
                          return (
                            <div style={st2.location}><img src={URL.createObjectURL(data)} alt="Passport" /></div>
                          )
                        }
                        else {
                          // Convert the base64 string to binary data
                          const binaryImageData = atob(data);
                          const arrayBuffer = new ArrayBuffer(binaryImageData.length);
                          const view = new Uint8Array(arrayBuffer);
                          for (let i = 0; i < binaryImageData.length; i++) {
                            view[i] = binaryImageData.charCodeAt(i);
                          }
                          // Create a Blob and generate a URL for displaying the image
                          const blob = new Blob([arrayBuffer], { type: 'image/png' });
                          return (
                            <div style={st2.location}><img src={URL.createObjectURL(blob)} alt="Passport" /></div>
                          )
                        }
                      } else {
                        return (
                          <strong><div style={st2.location}>Nothing</div></strong>
                        )
                      }
                    })}
                  </div>
                )
              })}

            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ViewData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewData);