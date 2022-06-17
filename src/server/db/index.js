const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
// const cors = require("cors");
const nodemailer = require("nodemailer");

async function main(details, email, uName) {
  const uri =
    "mongodb+srv://Gift:node1234@cluster0.kpzvc.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    // Make the appropriate DB calls
    await listDatabases(client);
    // console.log(details, uName, email, "if null ntwana yahm make a plan");

    // await createHeights(client, details, email, uName);
  } catch (error) {
    console.error(error, "this is the error from mongodb failed to connect");
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error(error);
});

//listing databases

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}
async function createHeights(client, newListing, email, uName) {
  const result = await client
    .db("UserHeight")
    .collection("listOfHeight")
    .insertOne(newListing)
    .then(() => {
      console.log(
        `new document created with the following id: '${result.insertedId}'`
      );
      findHeights(client, email, uName);
    })
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
    .aggregate(
      {
        $match: {
          $and: [
            { height: { $gte: initialValue } },
            { height: { $lte: NumberOfHeights } },
          ],
        },
      },
      { $group: { _id: null, sum: { $sum: "$height" } } }
    );
  //   .findOne("height")
  //   .limit(NumberOfHeights);
  // const result = await cursor.toArray();
  // const totalHeights = result.reduce(
  //   (previousValue, currentValue) => previousValue + currentValue,
  //   initialValue
  // );

  if (result) {
    console.log(`Found '${result}' height in the collection`);
    console.log(result);
    const total = parseFloat(result / count);
    sendToEmail(client, total, email, uName);
  } else {
    console.log(`No heights has been found in the collection`);
  }
}

async function sendToEmail(client, total, email, uName) {
  //const result = await
  // mailer.extend(app, {
  //   emailFrom: `${email}`,
  //   host: "smtp.gmail.com", // hostname
  //   secureConnection: true, // use SSL
  //   port: 465, // port for secure SMTP
  //   transportMethod: "SMTP", // default is SMTP.
  //   auth: {
  //     user: `${email}`, // Your Email
  //     pass: "*******", // Your Password
  //   },
  // });

  app.mailer.send(
    "../views/emailTemplate/emailTemplate.ejs",
    { to: `${email}`, subject: "Your Email Subject" },
    function (err, message) {
      if (err) throw new Error(err);
      console.log(message);
      return;
    }
  );
}

// mongoose
//   .connect(
//     "mongodb+srv://Gift:node1234@cluster0.kpzvc.mongodb.net/?retryWrites=true&w=majority",
//     { useNewUrlParser: true }
//   )
//   .catch((e) => {
//     console.error("Connection error", e.message);
//   });

//const db = mongoose.connection;
// const db = main();

// module.exports = db;
