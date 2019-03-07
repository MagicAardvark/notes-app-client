import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Login.scss';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    const { email, password } = { ...this.state };
    return email.length > 0 && password.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email, password } = { ...this.state };
    const { userHasAuthenticated, history } = { ...this.props };
    console.log(history, this.props);
    this.setState({ isLoading: true });

    try {
      await Auth.signIn(email, password);
      console.log('signed in');
      console.log('navigating');
      userHasAuthenticated(true);
      history.push('/');
    } catch (e) {
      // alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { email, password, isLoading } = { ...this.state };

    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  childProps: PropTypes.shape({
    userHasAuthenticated: PropTypes.func,
  }),
};

Login.defaultProps = {
  childProps: {},
};

export default Login;
