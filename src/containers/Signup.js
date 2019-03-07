import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Signup.scss';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
  }

  validateForm() {
    const { email, password, confirmPassword } = { ...this.state };
    return (
      email.trim().length > 0
      && password.trim().length > 0
      && password === confirmPassword
    );
  }

  validateConfirmationForm() {
    const { confirmationCode } = { ...this.state };
    return confirmationCode.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    const { email, password } = { ...this.state };
    try {
      const newUser = await Auth.signUp({
        username: email,
        password,
      });
      console.log('newUser', newUser);
      this.setState({
        newUser,
      });
    } catch (e) {
      console.log('e', e);
      if (e.code === 'UsernameExistsException') {
        this.signUpFailure();
      } else alert(e.message);
    }

    this.setState({ isLoading: false });
  }

  async signUpFailure() {
    try {
      const { email } = { ...this.state };
      await Auth.resendSignUp(email);
      this.setState({
        newUser: email,
      });
    } catch (e) {
      const { history } = { ...this.props };
      alert('User already exists, please log in');
      history.push('/login');
    }
  }

  async handleConfirmationSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    const { email, password, confirmationCode } = { ...this.state };
    const { userHasAuthenticated, history } = { ...this.props };
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);

      userHasAuthenticated(true);
      history.push('/');
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  renderConfirmationForm() {
    const { isLoading, confirmationCode } = { ...this.state };
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    const {
      email,
      password,
      confirmPassword,
      isLoading,
    } = { ...this.state };
    return (
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
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={confirmPassword}
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
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    const { newUser } = { ...this.state };
    return (
      <div className="Signup">
        {newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
