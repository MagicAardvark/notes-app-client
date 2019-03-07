import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { API } from 'aws-amplify';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import './NewNote.scss';

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    const { content } = { ...this.state };
    return content.trim().length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleFileChange(event) {
    // eslint-disable-next-line
    this.file = event.target.files[0];
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    const { content } = { ...this.state };
    const { history } = { ...this.props };
    try {
      await this.createNote({
        content,
      });
      history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  // TODO: work out a fix
  // eslint-disable-next-line class-methods-use-this
  createNote(note) {
    return API.post('notes', '/notes', {
      body: note,
    });
  }

  render() {
    const { content, isLoading } = { ...this.state };
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
