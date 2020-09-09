import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import "./Login.css";

//Login Page component
class Login extends Component {
  state = {
    username: "",
    password: "",
    message: "",
    isLoaded: true
  };

  //onchange fire event for both username and password input fields
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  //If user is already logged i.e, if jwt is present then push to home page after login
  componentDidMount() {
    if (localStorage.getItem("jwtToken")) {
      this.props.history.push("/");
    }
  }

  //submit handler to login with credentials
  onSubmit = e => {
    e.preventDefault();

    const { username, password } = this.state;
    this.setState({ isLoaded: false });
    axios
      .post("http://localhost:5000/api/auth/login", { username, password })
      .then(result => {
        //Login success case
        localStorage.setItem("jwtToken", result.data.token);
        localStorage.setItem("username", username);
        this.setState({ message: "", isLoaded: true });
        this.props.history.push("/");
      })
      .catch(error => {
        //error or exception case handled
        if (error.response.status === 401) {
          this.setState({
            message: "Login failed. Username or password not match",
            isLoaded: true
          });
        }
      });
  };

  render() {
    const { username, password, message } = this.state;
    return (
      <>
        <div className="container">
          <form className="form-signin" onSubmit={this.onSubmit}>
            {message !== "" && (
              <div
                className="alert alert-warning alert-dismissible"
                role="alert"
              >
                {message}
              </div>
            )}
            <h2 className="form-signin-heading">Please sign in</h2>
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
              Login
            </button>
            <p>
              Not a member?{" "}
              <Link to="/register">
                <span
                  className="glyphicon glyphicon-plus-sign"
                  aria-hidden="true"
                ></span>{" "}
                Register here
              </Link>
            </p>
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

export default withRouter(Login);
