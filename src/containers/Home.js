import React, { Component } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { API } from 'aws-amplify';
import './Home.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: [],
    };
  }

  async componentDidMount() {
    const { isAuthenticated } = { ...this.props };
    if (!isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return API.get('notes', '/notes');
  }

  renderNotesList(notes) {
    return [{}].concat(notes).map(
      (note, i) => (i !== 0
        ? (
          <LinkContainer
            key={note.noteId}
            to={`/notes/${note.noteId}`}
          >
            <ListGroupItem header={note.content.trim().split('\n')[0]}>
              {`Created: ${new Date(note.createdAt).toLocaleString()}`}
            </ListGroupItem>
          </LinkContainer>
        )
        : (
          <LinkContainer
            key="new"
            to="/notes/new"
          >
            <ListGroupItem>
              <h4>
                <b>{'\uFF0B'}</b>
                {' '}
                Create a new note
              </h4>
            </ListGroupItem>
          </LinkContainer>
        )),
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  renderNotes() {
    const { isLoading, notes } = { ...this.state };
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!isLoading && this.renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    const { isAuthenticated } = { ...this.props };
    return (
      <div className="Home">
        {isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
