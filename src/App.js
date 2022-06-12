import React, { useEffect, useState } from "react";
import { MDBBtn, MDBContainer, MDBInput } from "mdb-react-ui-kit";
import * as Realm from "realm-web";

const APP_ID = "62a53c841131ef1ef9e98b83";
//to write
const app = new Realm.App({ id: APP_ID });
//to retrive
const retrive = Realm.App.getApp(APP_ID);
const {
  BSON: { ObjectId },
} = Realm;

function App() {
  const [uName, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heightt, setHeights] = useState("");
  const [heightState, setHeightState] = useState(null);

  const loginEmailPassword = async () => {
    // Create an anonymous credential
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      // Authenticate the user
      const user = await app.logIn(credentials);
      // `App.currentUser` updates to match the logged in user
      console.assert(user.id === app.currentUser.id);
      writeToMongo(user.id);
      return user;
    } catch (err) {
      console.error("Failed to log in", err);
    }
  };

  const writeToMongo = async (id) => {
    const uid = id;
    const mongo = app.currentUser.mongoClient("databaseCluster");
    const collection = await mongo
      .db("databaseCluster")
      .collection("ListofUserHeight")
      .insertOne({
        _id: uid,
        height: heightt,
        uName: uName,
      })
      .then(() => {
        alert("Your height has been successfully submitted");
        readFromMongo();
      })
      .catch((error) => alert("Error: ", error, " or check your "));
  };

  const readFromMongo = async () => {
    const mongo = app.currentUser.mongoClient("databaseCluster");
    const collection = await mongo
      .db("databaseCluster")
      .collection("ListofUserHeight");
    const count = collection.count();
    const average = collection.findOne({
      height: "height",
    });
    const finalHeight = parseFloat(average / count);

    sendToEmail();
  };

  const sendToEmail = async () => {
    const request = await app.emailPasswordAuth
      .confirmUser({ token, tokenId })
      .then((confirm) => {
        alert("email has been sent");
      });
  };

  useEffect(() => {}, []);
  return (
    <MDBContainer fluid style={{ height: "100vh" }}>
      <div class="background-image: url('https://mdbootstrap.com/img/Photos/Others/img%20%2848%29.webp'); background-repeat: no-repeat; background-size: cover; background-position: center center;"></div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center justify-content-space-between">
          <MDBInput
            label="Name"
            id="typeText"
            type="text"
            onChange={(uNames) => setUname(uNames)}
            style={{ marginTop: 10 }}
          />
          <MDBInput
            label="Height"
            id="typeNumber"
            type="number"
            onChange={(heights) => setHeights(heights)}
            style={{ marginTop: 10 }}
          />
          <MDBInput
            label="Email"
            id="typeEmail"
            type="email"
            onChange={(mail) => setEmail(mail)}
            style={{ marginTop: 10 }}
          />
          <MDBInput
            label="Password"
            id="typePassword"
            type="password"
            onChange={(pass) => setPassword(pass)}
            style={{ marginTop: 10 }}
          />
          <MDBBtn
            className="text-dark"
            color="light"
            style={{ marginTop: 30, width: "100%" }}
            onClick={() => loginEmailPassword()}
          >
            Submit
          </MDBBtn>
        </div>
      </div>
    </MDBContainer>
  );
}

export default App;
