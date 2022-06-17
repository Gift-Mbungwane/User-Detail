import React, { Component } from "react";
import { MDBBtn, MDBContainer, MDBInput } from "mdb-react-ui-kit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// async function sendToEmail(client, total, email, uName) {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   // const testAccount = await nodemailer.createTestAccount();
//   // // create reusable transporter object using the default SMTP transport
//   // const transporter = nodemailer.createTransport({
//   //   host: `${email}`,
//   //   port: 587,
//   //   secure: false, // true for 465, false for other ports
//   //   auth: {
//   //     user: testAccount.user, // generated ethereal user
//   //     pass: testAccount.pass, // generated ethereal password
//   //   },
//   // });
//   // await transporter.sendMail({
//   //   from: `${email}`,
//   //   to: `${email}`,
//   //   subject: "Average height",
//   //   html: `<div className="email" style="
//   //       border: 1px solid black;
//   //       padding: 20px;
//   //       font-family: sans-serif;
//   //       line-height: 2;
//   //       font-size: 20px;
//   //       ">
//   //       <h2>Here is your email!</h2>
//   //       <p>${email}</p>
//   //        <p>${uName}</p>
//   //         <p>${total}</p>
//   //       <p>All the best, Darwin</p>
//   //        </div>
//   //   `,
//   // });
// }

export default class App extends Component {
  state = {
    uName: "",
    email: "",
    password: "",
    height: "",
  };
  constructor(props) {
    super(props);
  }

  appJs = async (event) => {
    api
      .post("/api", this.state)
      .then(() => window.alert("user details has been saved"));
  };

  setUname = async (event) => {
    const names = event.target.value;
    if (names == "") {
      window.alert("Please fill in your name");
    } else {
      this.setState({ uName: names });
    }
  };

  setHeights = async (event) => {
    const heightss = event.target.value;
    const regex = /([1 - 9] | 1[0 - 2])/;
    if (heightss == "") {
      window.alert("Please fill in your height");
    } else {
      this.setState({ height: heightss });
    }
  };

  setEmail = async (event) => {
    const emails = event.target.value;
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emails == "") {
      window.alert("Please fill in your email");
    } else {
      this.setState({ email: emails });
    }
  };

  setPassword = async (event) => {
    const passwords = event.target.value;
    if (passwords == "") {
      window.alert("Password is empty");
    } else {
      this.setState({ password: passwords });
    }
  };

  render() {
    return (
      <div className="background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSngyydjr-vCNS6hYnFssybw1BMuUeXz9_Apw&usqp=CAU'); background-repeat: no-repeat; background-size: cover; background-position: center center;">
        <MDBContainer fluid style={{ height: "100vh" }}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="text-center justify-content-space-between">
              <MDBInput
                label="Name"
                id="typeText"
                type="text"
                onChange={this.setUname}
                style={{ marginTop: 10 }}
              />
              <MDBInput
                label="Height"
                id="typeNumber"
                type="number"
                onChange={this.setHeights}
                style={{ marginTop: 10 }}
              />
              <MDBInput
                label="Email"
                id="typeEmail"
                type="email"
                onChange={this.setEmail}
                style={{ marginTop: 10 }}
              />
              <MDBInput
                label="Password"
                id="typePassword"
                type="password"
                //onEncrypted={true}
                onChange={this.setPassword}
                style={{ marginTop: 10 }}
              />
              <MDBBtn
                className="text-dark"
                color="light"
                style={{ marginTop: 30, width: "100%" }}
                onClick={this.appJs}
              >
                Submit
              </MDBBtn>
            </div>
          </div>
        </MDBContainer>
      </div>
    );
  }
}
