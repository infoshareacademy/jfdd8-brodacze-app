import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class Logpage extends Component {


  render() {
    return (
      <div className="Log">
        <header className="Log-header">
          <img src="pocketbook-min-org.png" className="Log-logo" alt="logo" />
          <h1 className="Log-title">Welcome to Pocketbook</h1>
        </header>
        <p className="Log-intro">
          Start saving your money with Us.
        </p>
        <Form>
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input type="email" name="email" id="yourEmail" required placeholder="Fill in your e-mail address"/>
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input type="password" name="password" id="yourPassword" required placeholder="Fill in your password"/>
          </FormGroup>
          <Button>Log in !</Button>
        </Form>
      </div>
    );
  }
}
export default Logpage;