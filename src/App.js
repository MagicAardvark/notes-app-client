import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import Routes from './Routes';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated(authenticated) {
    this.setState({ isAuthenticated: authenticated });
  }

  async handleLogout() {
    const { history } = { ...this.props };
    await Auth.signOut();
    this.userHasAuthenticated(false);
    history.push('/login');
  }

  render() {
    const { isAuthenticated, isAuthenticating } = { ...this.state };
    const childProps = {
      isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated.bind(this),
    };

    return (
      !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {
              isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : (
                  <Fragment>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
                )
            }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Routes childProps={childProps} />
      </div>
      )
    );
  }
}

export default withRouter(App);
