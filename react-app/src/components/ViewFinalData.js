import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from './axios-object';
import { getTemplateId, getDId, getStateValue, getAllFieldValues, setTemplateId, setDId, resetFieldValues, resetFilledMandatoryFieldIndicator, resetStateValues, setFieldValue } from './values';
import './ViewFinalData.css';

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

class ViewFinalData extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            tid: null,
            did: null,
            templateURL: null,
            formImageURL: null,
            name: null,
            date: null,
        }
    }

    static contextTypes = {
        router: PropTypes.object,
    }

    componentDidMount() {
        let tid = getTemplateId();
        let did = getDId();
        this.setState({ tid: tid, did: did });

        if (getTemplateId() < 100) {

            const url = window.URL.createObjectURL(new Blob([getStateValue("form-image")]));
            this.setState({ formImageURL: url });

            // Make a request to fetch the file data
            axios.get('/getTemplateFile/' + tid, { responseType: 'blob' })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    // Set the URL to a state variable
                    this.setState({ templateURL: url });
                });

        }

        const dataToSend = getAllFieldValues();

        // Filter out key-value pairs with null values
        const filteredData = Object.fromEntries(
            Object.entries(dataToSend).filter(([key, value]) => value !== null)
        );

        if (getTemplateId() < 100) {
            axios.post('/showFinalMarked/' + tid, filteredData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    this.setState({ data: response.data });
                });
        }
    }

    handleInputChange = (e) => {
        // Access the new value from the input field
        const newValue = e.target.value;
        setFieldValue(e.target.getAttribute('data-field'), newValue);
    };

    handleNameChange = (e) => {
        const newName = e.target.value;
        this.setState({ name: newName });
    };

    handleDateChange = (e) => {
        const newDate = e.target.value;
        this.setState({ date: newDate });
    };

    getPreview = () => {
        return Object.entries(getAllFieldValues()).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ));
    };


    handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = getAllFieldValues();

        // Filter out key-value pairs with null values
        const filteredData = Object.fromEntries(
            Object.entries(dataToSend).filter(([key, value]) => value !== null)
        );

        // Check if there are non-null values to submit
        if (Object.keys(filteredData).length === 0) {
            alert('No data to submit.');
            return;
        }

        if (this.state.name !== null) {
            if (this.state.date !== null) {
                // Get today's date in the format YYYY-MM-DD
                const today = new Date().toISOString().split('T')[0];

                // Convert the entered date to the same format
                const enteredDate = this.state.date.split('-').reverse().join('-');
                if (today === enteredDate) {
                    filteredData['e-validation-name'] = this.state.name;
                    filteredData['e-validation-date'] = this.state.date;

                    const formData = new FormData();
                    formData.append('userInput', JSON.stringify(filteredData));
                    formData.append('selectedFormId', getTemplateId());
                    if ('passportImage' in filteredData) {
                        formData.append('passportImage', getAllFieldValues()['passportImage']);
                    }
                    let url=''

                    if(getTemplateId()<100)
                    url = `http://localhost:3001/saveResponse`;
                    else
                    url = `http://localhost:5000/submit_form${getTemplateId()}`;

                    // Send a POST request to the server
                    fetch(url, {
                        method: 'POST',
                        body: formData,
                        
                    })
                        .then(response => {
                            if (response.status !== 200) {
                                throw new Error('Network response was not ok');
                            }
                        })
                        .then(() => {
                            // Handle success
                            alert('Response Submitted');
                            setTemplateId(0);
                            setDId(0);
                            resetFieldValues();
                            resetFilledMandatoryFieldIndicator();
                            resetStateValues();
                            window.history.pushState({}, null, "/formsList");
                            window.dispatchEvent(new Event('popstate'));
                        })
                        .catch(error => {
                            // Handle error
                            console.error('Error submitting response:', error);
                            alert('Failed to submit response. Please try again.');
                        });
                } else {
                    alert('Enter today\'s date.');
                }
            } else {
                alert('Enter today\'s date.');
            }
        } else {
            alert('Enter your full name.');
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {getTemplateId()>100 ?
                        <div className="preview-section">
                            <h3>Preview:</h3>
                            {this.getPreview()}
                        </div>
                    :
                    <Grid container wrap="nowrap" spacing={24}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <img src={this.state.formImageURL} className={classes.image} alt='' />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.finalpaper}>
                                <img src={this.state.templateURL} className={classes.image} alt='' />

                                {this.state.data.map((field, key) => {

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
                                                if (field[data]["type"] === "Text") {
                                                    return (
                                                        <strong><div style={st2.location}><input type="text" class="transparent-input" placeholder={data} defaultValue={data}
                                                            data-field={field[data]['field']} onChange={(e) => this.handleInputChange(e)} /></div></strong>
                                                    )
                                                }
                                                else if (field[data]["type"] === "Signature") {
                                                    if (data === 'passportImage') {
                                                        if (getAllFieldValues()['passportImage'] instanceof Blob) {
                                                            return (
                                                                <div style={st2.location}><img src={URL.createObjectURL(getAllFieldValues()['passportImage'])} alt="Passport" /></div>
                                                            )
                                                        }
                                                        else {
                                                            // Convert the base64 string to binary data
                                                            const binaryImageData = atob(getAllFieldValues()['passportImage']);
                                                            const arrayBuffer = new ArrayBuffer(binaryImageData.length);
                                                            const view = new Uint8Array(arrayBuffer);
                                                            for (let i = 0; i < binaryImageData.length; i++) {
                                                                view[i] = binaryImageData.charCodeAt(i);
                                                            }
                                                            // Create a Blob and generate a URL for displaying the image
                                                            const blob = new Blob([arrayBuffer], { type: 'image/png' });
                                                            setFieldValue(field[data]['field'], blob);
                                                            return (
                                                                <div style={st2.location}><img src={URL.createObjectURL(blob)} alt="Passport" /></div>
                                                            )
                                                        }
                                                        // else {
                                                        //     // Fetch the blob data from the FormData object
                                                        //     console.log(" form data - ", field[data]["imageData"])
                                                        //     const blobData = field[data]["imageData"].get('image');
                                                        //     return (
                                                        //         <div style={st2.location}><img src={URL.createObjectURL(blobData)} alt="Passport" /></div>
                                                        //     )
                                                        // }
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
                                                        setFieldValue('passportImage', blob);
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
                }
                <div>
                    <input type="text" onChange={this.handleNameChange} placeholder="Your Name" />
                    <input type="text" onChange={this.handleDateChange} placeholder="Date - DD-MM-YYYY" />
                    <Button variant="contained" color="primary" className={classes.button} type="submit" onClick={this.handleSubmit}>
                        Submit Response
                    </Button>
                </div>
            </div>
        );
    }
}

ViewFinalData.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewFinalData);