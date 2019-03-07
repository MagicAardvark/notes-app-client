import React, { Component } from 'react';
import { API, Storage } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { s3Upload, s3Delete } from '../libs/awsLib';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import './Notes.scss';

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: '',
      attachmentURL: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const note = await this.getNote();
      const { content, attachment } = note;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        note,
        content,
        attachmentURL,
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    const { match } = { ...this.props };
    return API.get('notes', `/notes/${match.params.id}`);
  }

  validateForm() {
    const { content } = { ...this.state };
    return content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, '');
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

  saveNote(note) {
    const { match } = { ...this.props };
    return API.put('notes', `/notes/${match.params.id}`, {
      body: note,
    });
  }

  async handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      const { content, note } = { ...this.state };
      const { history } = { ...this.props };
      await this.saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      if (note.attachment) {
        await s3Delete(note.attachment);
      }
      history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteNote() {
    const { match } = { ...this.props };
    return API.del('notes', `/notes/${match.params.id}`);
  }

  async handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?',
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    const { note } = { ...this.state };
    const { history } = { ...this.props };
    try {
      await this.deleteNote();
      if (note.attachment) {
        await s3Delete(note.attachment);
      }
      history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    const {
      note, content, attachmentURL, isLoading, isDeleting,
    } = { ...this.state };
    return (
      <div className="Notes">
        {note
          && (
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={content}
                componentClass="textarea"
              />
            </FormGroup>
            {note.attachment
              && (
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={attachmentURL}
                  >
                    {this.formatFilename(note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>
              )}
            <FormGroup controlId="file">
              {!note.attachment
                && <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
          )}
      </div>
    );
  }
}
