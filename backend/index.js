const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const axios = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const path = require("path");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const cors = require("cors");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const {
  CognitoIdentityProviderClient,
  GetUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const {
  CloudSearchDomainClient,
  SearchCommand,
} = require("@aws-sdk/client-cloudsearch-domain");
const app = express();
const upload = multer({ dest: "uploads/" });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const poolData = {
  UserPoolId: "us-east-1_7LtzaMZkV",
  ClientId: "561lvahudrbbbqufclpsfjgadc",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const dynamoDb = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDb, {
  marshallOptions: { removeUndefinedValues: true },
});
const s3Client = new S3Client({
  region: "us-east-1", // Update this with your S3 region
});

app.post("/api/v1/verify_token", async (req, res) => {
  const token = req.body.token;

  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

  const params = {
    AccessToken: token,
  };

  try {
    const command = new GetUserCommand(params);
    const response = await client.send(command);

    // Token is valid, set the user in state or perform any other necessary actions
    const user = response.UserAttributes;
    res.json({ statusCode: 200, user });
  } catch (error) {
    // Token is invalid or expired, clear the token from local storage
    res.json({ statusCode: 400, error, user: null });
  }
});

app.get("/api/v1/opportunities/:organizationId/:id", async (req, res) => {
  const organizationId = req.params.organizationId;
  const id = parseInt(req.params.id);
  const params = {
    TableName: "PlatePals",
    Key: {
      id,
      organizationId,
    },
  };

  try {
    const command = new GetCommand(params);
    const response = await ddbDocClient.send(command);

    if (response.Item) {
      res.json(response.Item);
    } else {
      res.status(404).send("Opportunity not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving opportunity");
  }
});

app.get("/api/v1/opportunities", async (req, res) => {
  // Extract query parameters
  const {
    searchTerm,
    searchLocation,
    limit = 9,
    lastEvaluatedKey,
    organizationId,
  } = req.query;
  let latitude;
  let longitude;

  if (searchLocation !== "" && searchLocation !== undefined) {
    const apiKey = "AIzaSyAELzQedRkBkX8gYQZYjMg9dMqDmph_9MM";

    await axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: searchLocation,
          key: apiKey,
        },
      })
      .then((response) => {
        const results = response.data.results;
        if (results.length > 0) {
          const coordinates = results[0].geometry.location;
          latitude = coordinates.lat;
          longitude = coordinates.lng;
        } else {
          console.log("Location not found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Create an instance of the CloudSearchDomainClient
  const cloudSearchClient = new CloudSearchDomainClient({
    region: "us-east-1", // Replace with your AWS region
    endpoint:
      "https://search-platepals-dno26mtgddk4w77a6qyh3gamlu.us-east-1.cloudsearch.amazonaws.com", // Replace with your CloudSearch endpoint
  });

  // Construct the search query
  let searchParams = {
    query: "matchall",
    size: parseInt(limit), // Maximum number of items to return
    start: lastEvaluatedKey ? parseInt(lastEvaluatedKey) : 0, // Pagination offset
    queryParser: "structured",
  };

  // Conditionally add the query parameter if searchTerm is not empty
  if (searchTerm !== "" && searchTerm !== undefined) {
    searchParams.query = searchTerm;
    searchParams.queryParser = undefined;
  }

  if (organizationId !== "" && organizationId !== undefined) {
    searchParams.filterQuery = `organizationid: '${organizationId}'`;
  }

  if (isNaN(limit)) searchParams.size = 9;

  if (searchLocation !== "" && searchLocation !== undefined) {
    const exprObj = {
      distance: `haversin(${latitude}, ${longitude}, coordinates.latitude, coordinates.longitude)`,
    };

    searchParams.expr = JSON.stringify(exprObj);
    searchParams.sort = "distance asc";
    searchParams.return =
      "distance,coordinates,applicants,description,id,organizationid,organizationname,rate,title,location";
  }

  try {
    // Send the search command to CloudSearch
    const searchCommand = new SearchCommand(searchParams);
    const searchResponse = await cloudSearchClient.send(searchCommand);

    // Extract the search results from the response
    const items = searchResponse.hits.hit.map((hit) => {
      const fields = hit.fields;
      // Convert array values to single elements
      const item = {};
      for (const [key, value] of Object.entries(fields)) {
        item[key] = value[0];
      }
      return item;
    });

    // Extract the LastEvaluatedKey for pagination
    const lastEvaluatedKey =
      searchResponse.hits.hit.length > 0
        ? String(searchResponse.hits.hit[searchResponse.hits.hit.length - 1].id)
        : null;

    return res.json({ items, lastEvaluatedKey });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not load items" });
  }
});

app.post("/api/v1/create_user", (req, res) => {
  const userData = req.body;

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

app.post("/api/v1/signin", async (req, res) => {
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
    onSuccess: async (result) => {
      const token = result.getAccessToken().getJwtToken();
      const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

      const params = {
        AccessToken: token,
      };

      try {
        const command = new GetUserCommand(params);
        const response = await client.send(command);

        // Token is valid, set the user in state or perform any other necessary actions
        const user = response.UserAttributes;
        res.send({
          statusCode: 200,
          user: user,
          accessToken: token,
        });
      } catch (error) {
        // Token is invalid or expired, clear the token from local storage
        res.json({ statusCode: 400, error, user: null });
      }
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

app.post("/api/v1/apply", upload.single("resume"), async (req, res) => {
  const application = req.body;
  const resume = req.file; // This is how you get the uploaded file

  const fileStream = fs.createReadStream(
    path.join(__dirname, "/uploads/", resume.filename)
  );
  const uploadParams = {
    Bucket: "plate-pals-resumes",
    Key: `resumes/${resume.filename}`, // or any path you want to put file to in your bucket
    Body: fileStream,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));

    const dbItem = {
      TableName: "PlatePalsApplications",
      Item: {
        ...application, // Add other application fields here
        id: parseInt(application.id),
        organizationId: parseInt(application.organizationId),
        resumeKey: `resumes/${resume.filename}`,
      },
    };

    await ddbDocClient.send(new PutCommand(dbItem));

    res.json({ message: "Application successfully created" });

    fs.unlink(path.join(__dirname, "/uploads/", resume.filename), (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log("Error", err);
  }
});

app.get("/api/v1/applications", async (req, res) => {
  const { organizationId, userId, opportunityId } = req.query;

  const params = {
    TableName: "PlatePalsApplications", // Replace with your DynamoDB table name)
    FilterExpression: "userId = :sub",
    ExpressionAttributeValues: {
      ":sub": userId,
    },
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    const applications = data.Items;
    return res.json(applications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not load applications" });
  }
});

app.post("/api/v1/opportunities", async (req, res) => {
  const opportunity = req.body;
  const apiKey = "AIzaSyAELzQedRkBkX8gYQZYjMg9dMqDmph_9MM";

  try {
    const result = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: opportunity.location,
          key: apiKey,
        },
      }
    );

    const dbItem = {
      TableName: "PlatePals",
      Item: {
        ...opportunity, // Add other application fields here
        id: parseInt(opportunity.id),
        organizationId: opportunity.organizationId,
        location: result.data.results[0].formatted_address,
        coordinates: `${result.data.results[0].geometry.location.lat}, ${result.data.results[0].geometry.location.lng}`,
        status: "Open",
        applicants: 0,
      },
    };

    await ddbDocClient.send(new PutCommand(dbItem));

    res.json({ message: "Opportunity successfully created" });
  } catch (error) {
    console.error(`Failed to get location: ${error}`);
    res.json({ message: `Failed to create opportunity: ${error}` });
  }
});

app.listen(3001, () => console.log("server listening on port 3001"));
