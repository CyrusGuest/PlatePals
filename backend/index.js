const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const poolData = {
  UserPoolId: "us-east-1_7LtzaMZkV",
  ClientId: "561lvahudrbbbqufclpsfjgadc",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/api/v1/create_user", (req, res) => {
  const userData = req.body;

  console.log(req.body);

  let attributeList = [];

  const dataEmail = {
    Name: "email",
    Value: userData.email,
  };

  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataEmail
  );

  const dataName = {
    Name: "name",
    Value: userData.name,
  };

  const attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataName
  );

  const dataAccountType = {
    Name: "custom:account_type",
    Value: userData.account_type,
  };

  const attributeAccountType = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataAccountType
  );

  attributeList.push(attributeEmail);
  attributeList.push(attributeName);
  attributeList.push(attributeAccountType);

  userPool.signUp(
    userData.name.replace(/\s/g, ""),
    userData.password,
    attributeList,
    null,
    (err, result) => {
      if (err) {
        console.error(err);
        res.json({ statusCode: 400, user: null, error: err.message });
        return;
      }

      const cognitoUser = result.user;
      res.json({ statusCode: 200, user: cognitoUser });
    }
  );
});

app.post("/api/v1/signin", (req, res) => {
  const { email, password } = req.body;

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    {
      Username: email,
      Password: password,
    }
  );

  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      const accessToken = result.getAccessToken().getJwtToken();
      res.send({
        statusCode: 200,
        user: cognitoUser,
        accessToken,
      });
    },
    onFailure: (err) => {
      res.status(401).send({
        statusCode: 401,
        error: err.message,
      });
    },
  });
});

app.post("/api/v1/confirm_user", (req, res) => {
  const { username, confirmationCode } = req.body;

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
    if (err) {
      console.error(err);
      res.send({ statusCode: 400, user: null, error: err.message });
      return;
    }
    // if successful, the result will be 'SUCCESS'
    res.send({ statusCode: 200, user: cognitoUser, result });
  });
});

app.listen(3001, () => console.log("server listening on port 3001"));
