const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const apiPort = 3000;
const db = require("./db");
const { MongoClient, ServerApiVersion } = require("mongodb");
const nodemailer = require("nodemailer");
//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
//db
//db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.post("/api", async function (req, res) {
  // posting data to database
  const uri =
    "mongodb+srv://Gift:node1234@cluster0.kpzvc.mongodb.net/?retryWrites=true&w=majority";
  const client = await new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    // Make the appropriate DB calls
    // await listDatabases(client);
    // console.log(details, uName, email, "if null ntwana yahm make a plan");
    await createHeights(client, req.body, req.body.email, req.body.uName);
    await findHeights(client, req.body.email, req.body.uName);
  } catch (error) {
    console.error(error, "this is the error from mongodb failed to connect");
  } finally {
    client.close();
  }
  // console.log(req.body, "from local 3001 to 3000"); // the posted data
  // console.log(req.body.uName, "the uName youve been looking for");
});

async function createHeights(client, newListing, email, uName) {
  const result = await client
    .db("UserHeight")
    .collection("listOfHeight")
    .insertOne(newListing)
    .then(() => {})
    .catch((error) => console.log(error));
}

async function findHeights(
  client,
  email,
  uName,
  { initialValue = 0, NumberOfHeights = Number.MAX_SAFE_INTEGER } = {}
) {
  const count = await client
    .db("UserHeight")
    .collection("listOfHeight")
    .count();

  const result = await client
    .db("UserHeight")
    .collection("listOfHeight")
    .aggregate([{ $group: { _id: null, sum: { $sum: "$height" } } }]);
  //   .findOne("height")
  //   .limit(NumberOfHeights);
  // const result = await cursor.toArray();
  // const totalHeights = result.reduce(
  //   (previousValue, currentValue) => previousValue + currentValue,
  //   initialValue
  // );

  counting(count, result);
}

async function counting(count, result) {
  const res = await result;
  const counts = await count;
  console.log(`Found '${result}' height in the collection`);
  const total = parseFloat(res / count);
  console.log(total, " the final height");
  // sendToEmail(client, total, email, uName);
}

// async function sendToEmail(client, total, email, uName) {
//   //const result = await
//   // mailer.extend(app, {
//   //   emailFrom: `${email}`,
//   //   host: "smtp.gmail.com", // hostname
//   //   secureConnection: true, // use SSL
//   //   port: 465, // port for secure SMTP
//   //   transportMethod: "SMTP", // default is SMTP.
//   //   auth: {
//   //     user: `${email}`, // Your Email
//   //     pass: "*******", // Your Password
//   //   },
//   // });

//   app.mailer.send(
//     "../views/emailTemplate/emailTemplate.ejs",
//     { to: `${email}`, subject: "Your Email Subject" },
//     function (err, message) {
//       if (err) throw new Error(err);
//       console.log(message);
//       return;
//     }
//   );
// }

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
