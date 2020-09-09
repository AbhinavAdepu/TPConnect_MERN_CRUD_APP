import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

//Returns registration page component
class Create extends Component {
  //set initial state for registration
  state = {
    username: "",
    password: "",
    isAlreadyMember: false,
    isLoaded: true
  };

  //onchange fire event for both username and password input fields
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  //submit handler to create user with valid credentials
  onSubmit = e => {
    e.preventDefault();

    const { username, password } = this.state;
    this.setState({ isLoaded: false, isAlreadyMember: false });
    axios
      .post("http://localhost:5000/api/auth/register", { username, password })
      .then(result => {
        this.setState({ isLoaded: true });
        const resultz = result.data;
        //if Username already exists
        if (!resultz.success && resultz.msg === "Username already exists.")
          this.setState({ isAlreadyMember: true });
        //if Successful created new user
        if (resultz.success && resultz.msg === "Successful created new user.")
          this.props.history.push("/login");
      });
  };

  render() {
    const { username, password } = this.state;
    return (
      <>
        <div className="container">
          <form className="form-signin" onSubmit={this.onSubmit}>
            <h2 className="form-signin-heading">Register</h2>
            <label className="sr-only">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              name="username"
              value={username}
              onChange={this.onChange}
              required
            />
            <label className="sr-only">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={password}
              onChange={this.onChange}
              required
            />
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Register
            </button>
            <p>
              Already a member?{" "}
              <Link to="/login">
                <span
                  className="glyphicon glyphicon-plus-sign"
                  aria-hidden="true"
                ></span>{" "}
                Login here
              </Link>
            </p>
            {this.state.isAlreadyMember && (
              <h6 style={{ color: "red" }}>User Already Exists.Pls Login</h6>
            )}
          </form>
        </div>
        <div
          className="loaderParent"
          style={{ display: !this.state.isLoaded ? "block" : "none" }}
        >
          <div id="loader" className="loader"></div>
        </div>
      </>
    );
  }
}

export default Create;
