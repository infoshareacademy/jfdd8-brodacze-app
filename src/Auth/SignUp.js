import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signUp } from '../state/auth';
// import SignUpGoogle from "./SignUpGoogle";
import firebase from 'firebase'

class SignUp extends Component {

  state = {
    email: '',
    password: '',
    error: null
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  handleSubmit = event => {
    event.preventDefault();

    this.props.signUp(
      this.state.email,
      this.state.password
    ).catch(
      error => this.setState({ error })
    )
  };

  signUpGoogle = (...args) => dispatch => {
    var provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
  };

  render() {
    return (
      <div>
        <h3>Sign Up</h3>
        {this.state.error && <p style={{ color: 'red' }}>{this.state.error.message}</p>}
        <form
          onSubmit={this.handleSubmit}
        >
          <div>
            E-mail :
          <input
            onChange={this.handleChange}
            name="email"
            type="email"
            required
          />
          </div>

          <div>
            Password :
          <input
            onChange={this.handleChange}
            name="password"
            type="password"
            required
          />
          </div>
          <button className={'button-log'}>Sign up via e-mail</button>
        </form>
      </div>
    )
  }
}

export default connect(
  null,
  { signUp }
)(SignUp)