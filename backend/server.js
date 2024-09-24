/**
 * @file server.js
 * @description This file contains the main server code for the PlatePals backend. It sets up an Express server with various routes for handling API requests related to opportunities, applications, and user authentication. It also integrates with AWS services such as DynamoDB, S3, and Cognito.
 */

/**
 * Middleware setup for logging, CORS, and JSON parsing.
 */

/**
 * Generates a secret hash for AWS Cognito.
 * @param {string} username - The username.
 * @param {string} clientId - The client ID.
 * @param {string} clientSecret - The client secret.
 * @returns {string} - The generated secret hash.
 */

/**
 * Initializes AWS clients for DynamoDB, S3, and Cognito.
 */

/**
 * Basic health check route.
 * @route GET /api/v1/basic-hc
 * @returns {string} - "OK" if the server is running.
 */

/**
 * Retrieves a specific opportunity by organization ID and opportunity ID.
 * @route GET /api/v1/opportunities/:organizationId/:id
 * @param {string} organizationId - The ID of the organization.
 * @param {number} id - The ID of the opportunity.
 * @returns {Object} - The opportunity data.
 */

/**
 * Retrieves all opportunities for a specific organization.
 * @route GET /api/v1/opportunities/:organizationId
 * @param {string} organizationId - The ID of the organization.
 * @returns {Array} - A list of opportunities.
 */

/**
 * Retrieves opportunities with optional search parameters.
 * @route GET /api/v1/opportunities
 * @param {string} [searchTerm] - The search term.
 * @param {string} [searchLocation] - The search location.
 * @param {number} [limit=9] - The maximum number of results to return.
 * @param {string} [lastEvaluatedKey] - The last evaluated key for pagination.
 * @param {string} [organizationId] - The ID of the organization.
 * @returns {Object} - A list of opportunities and the last evaluated key.
 */

/**
 * Retrieves applications for a specific listing.
 * @route GET /api/v1/listings/:listingId/applications
 * @param {string} listingId - The ID of the listing.
 * @returns {Array} - A list of applications.
 */

/**
 * Retrieves applications for a specific user.
 * @route GET /api/v1/applications
 * @param {string} userId - The ID of the user.
 * @returns {Array} - A list of applications.
 */

/**
 * Retrieves the resume for a specific application.
 * @route GET /api/v1/applications/:id/resume
 * @param {number} id - The ID of the application.
 * @returns {Buffer} - The resume PDF.
 */

/**
 * Verifies a Cognito token.
 * @route POST /api/v1/verify_token
 * @param {string} token - The Cognito token.
 * @returns {Object} - The user attributes if the token is valid.
 */

/**
 * Creates a new user in Cognito.
 * @route POST /api/v1/create_user
 * @param {Object} userData - The user data.
 * @returns {Object} - The created user information.
 */

/**
 * Signs in a user using Cognito.
 * @route POST /api/v1/signin
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} - The user attributes and access token.
 */

/**
 * Confirms a user's sign-up in Cognito.
 * @route POST /api/v1/confirm_user
 * @param {string} username - The username.
 * @param {string} confirmationCode - The confirmation code.
 * @returns {Object} - The confirmation result.
 */

/**
 * Applies for an opportunity.
 * @route POST /api/v1/apply
 * @param {Object} application - The application data.
 * @param {Object} resume - The uploaded resume file.
 * @returns {Object} - A success message.
 */

/**
 * Creates a new opportunity.
 * @route POST /api/v1/opportunities
 * @param {Object} opportunity - The opportunity data.
 * @returns {Object} - A success message.
 */

/**
 * Updates an application.
 * @route PUT /api/v1/applications/:id
 * @param {number} id - The ID of the application.
 * @param {Object} updatedApplication - The updated application data.
 * @returns {Object} - A success message.
 */

/**
 * Starts the Express server on port 8080.
 */

const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const axios = require("axios");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const cors = require("cors");
const {
  CognitoIdentityProviderClient,
  GetUserCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require("crypto");
const app = express();
const upload = multer({ dest: "uploads/" });

// MIDDLEWARE
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Handle preflight OPTIONS request for all routes
app.options("*", cors());
app.use(express.json());

// Function to compute the secret hash
function generateSecretHash(username, clientId, clientSecret) {
  const hmac = crypto.createHmac("sha256", clientSecret);
  hmac.update(username + clientId);
  return hmac.digest("base64");
}

// Initializing AWS Clients

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDb, {
  marshallOptions: { removeUndefinedValues: true },
});

const s3Client = new S3Client({
  region: "us-east-1", // Update this with your S3 region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

// GET ROUTES

app.get("/api/v1/basic-hc", (req, res) => {
  res.status(200).send("OK");
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

app.get("/api/v1/opportunities/:organizationId", async (req, res) => {
  const organizationId = req.params.organizationId;

  const params = {
    TableName: "PlatePals",
    FilterExpression: "#orgId = :orgId",
    ExpressionAttributeNames: {
      "#orgId": "organizationId",
    },
    ExpressionAttributeValues: {
      ":orgId": organizationId,
    },
  };

  try {
    const command = new ScanCommand(params);
    const response = await ddbDocClient.send(command);

    if (response.Items && response.Items.length > 0) {
      res.json(response.Items);
    } else {
      res.status(404).send("No opportunities found for this organization");
    }
  } catch (error) {
    console.error("Error retrieving opportunities:", error);
    res.status(500).send("Error retrieving opportunities");
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

  if (searchLocation !== undefined) {
    const apiKey = process.GOOGLE_API_KEY; // Replace with your Google API key

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: searchLocation,
            key: apiKey,
          },
        }
      );
      const results = response.data.results;
      if (results.length > 0) {
        const coordinates = results[0].geometry.location;
        latitude = coordinates.lat;
        longitude = coordinates.lng;
      } else {
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Create an instance of the DynamoDB client
  const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" }); // Replace with your AWS region

  // Construct the scan parameters
  let scanParams = {
    TableName: "PlatePals", // Replace with your DynamoDB table name
    Limit: parseInt(limit),
    ExclusiveStartKey: lastEvaluatedKey
      ? JSON.parse(lastEvaluatedKey)
      : undefined,
  };

  // Filter expression components
  let filterExpressions = [];
  let expressionAttributeNames = {};
  let expressionAttributeValues = {};

  // Add search term to the filter if provided
  if (searchTerm) {
    // DynamoDB doesn't support full-text search, so we need to implement a workaround
    // For example, we can use a contains function on the fields
    filterExpressions.push(
      "(contains(#title, :searchTerm) OR contains(#description, :searchTerm))"
    );
    expressionAttributeNames["#title"] = "title";
    expressionAttributeNames["#description"] = "description";
    expressionAttributeValues[":searchTerm"] = { S: searchTerm };
  }

  // Filter by organizationId if provided
  if (organizationId) {
    filterExpressions.push("#organizationId = :organizationId");
    expressionAttributeNames["#organizationId"] = "organizationId";
    expressionAttributeValues[":organizationId"] = { S: organizationId };
  }

  // Build the filter expression
  if (filterExpressions.length > 0) {
    scanParams.FilterExpression = filterExpressions.join(" AND ");
    scanParams.ExpressionAttributeNames = expressionAttributeNames;
    scanParams.ExpressionAttributeValues = expressionAttributeValues;
  }

  try {
    // Execute the scan command
    const scanCommand = new ScanCommand(scanParams);
    const scanResponse = await dynamoDBClient.send(scanCommand);

    // Unmarshall the items
    const items = scanResponse.Items;
    // const items = scanResponse.Items.map((item) => unmarshall(item));

    // Handle geospatial filtering manually
    if (searchLocation && latitude && longitude) {
      // Assuming your items have 'latitude' and 'longitude' attributes
      const radiusInKm = 100; // Adjust the distance as needed
      const earthRadiusInKm = 6371;

      const filteredItems = items.filter((item) => {
        if (item.latitude && item.longitude) {
          const dLat = (item.latitude - latitude) * (Math.PI / 180);
          const dLon = (item.longitude - longitude) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * (Math.PI / 180)) *
              Math.cos(item.latitude * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = earthRadiusInKm * c;
          return distance <= radiusInKm;
        }
        return false;
      });

      // Sort by distance
      filteredItems.sort((a, b) => {
        const dLatA = (a.latitude - latitude) * (Math.PI / 180);
        const dLonA = (a.longitude - longitude) * (Math.PI / 180);
        const aA =
          Math.sin(dLatA / 2) * Math.sin(dLatA / 2) +
          Math.cos(latitude * (Math.PI / 180)) *
            Math.cos(a.latitude * (Math.PI / 180)) *
            Math.sin(dLonA / 2) *
            Math.sin(dLonA / 2);
        const cA = 2 * Math.atan2(Math.sqrt(aA), Math.sqrt(1 - aA));
        const distanceA = earthRadiusInKm * cA;

        const dLatB = (b.latitude - latitude) * (Math.PI / 180);
        const dLonB = (b.longitude - longitude) * (Math.PI / 180);
        const aB =
          Math.sin(dLatB / 2) * Math.sin(dLatB / 2) +
          Math.cos(latitude * (Math.PI / 180)) *
            Math.cos(b.latitude * (Math.PI / 180)) *
            Math.sin(dLonB / 2) *
            Math.sin(dLonB / 2);
        const cB = 2 * Math.atan2(Math.sqrt(aB), Math.sqrt(1 - aB));
        const distanceB = earthRadiusInKm * cB;

        return distanceA - distanceB;
      });

      // Limit the results after filtering and sorting
      const limitedItems = filteredItems.slice(0, limit);
      const lastEvaluatedKey = scanResponse.LastEvaluatedKey
        ? JSON.stringify(scanResponse.LastEvaluatedKey)
        : null;

      return res.json({ items: limitedItems, lastEvaluatedKey });
    } else {
      // No location-based filtering needed
      const lastEvaluatedKey = scanResponse.LastEvaluatedKey
        ? JSON.stringify(scanResponse.LastEvaluatedKey)
        : null;

      return res.json({ items, lastEvaluatedKey });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not load items" });
  }
});

app.get("/api/v1/listings/:listingId/applications", async (req, res) => {
  const listingId = req.params.listingId;
  const params = {
    TableName: "PlatePalsApplications", // Replace with your DynamoDB table name)
    FilterExpression: "opportunityId = :sub",
    ExpressionAttributeValues: {
      ":sub": listingId,
    },
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    const applications = data.Items;
    return res.json(applications);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Could not load applications" });
  }
});

app.get("/api/v1/applications", async (req, res) => {
  const { userId } = req.query;

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

app.get("/api/v1/listings/:listingId/applications", async (req, res) => {
  const listingId = req.params.listingId;
  const params = {
    TableName: "PlatePalsApplications", // Replace with your DynamoDB table name)
    FilterExpression: "opportunityId = :sub",
    ExpressionAttributeValues: {
      ":sub": listingId,
    },
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    const applications = data.Items;
    return res.json(applications);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Could not load applications" });
  }
});

app.get("/api/v1/applications/:id/resume", async (req, res) => {
  let application;
  const id = parseInt(req.params.id);

  try {
    const params = {
      TableName: "PlatePalsApplications", // Replace with your DynamoDB table name
      FilterExpression: "id = :sub",
      ExpressionAttributeValues: {
        ":sub": id,
      },
    };

    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    application = data.Items[0];
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Could not load application" });
  }

  try {
    const params = {
      Bucket: "platepalsbucket",
      Key: application.resumeKey,
    };

    const command = new GetObjectCommand(params);
    const resume = await s3Client.send(command);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');

    resume.Body.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not load resume PDF" });
  }
});

// POST ROUTES

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

app.post("/api/v1/create_user", async (req, res) => {
  const userData = req.body;

  const clientId = "1t05m2f66hgpqiro4pps4hench";
  const clientSecret = "no8512l17qln74ltd11fbh55j80rgok0e9c77anqrhikebqe0l8";

  const secretHash = generateSecretHash(userData.email, clientId, clientSecret);

  const input = {
    ClientId: clientId,
    SecretHash: secretHash, // Required when using client secret
    Username: userData.email, // required
    Password: userData.password, // required
    UserAttributes: [
      {
        Name: "name", // required
        Value: userData.name,
      },
      {
        Name: "email", // required
        Value: userData.email,
      },
      {
        Name: "custom:account_type", // example of custom attribute
        Value: userData.account_type,
      },
    ],
  };

  const command = new SignUpCommand(input);

  try {
    const response = await client.send(command);

    res.json({
      statusCode: 200,
      message: "Sign up successful",
      user: {
        sub: response.UserSub,
        username: userData.name.replace(/\s/g, ""),
        email: userData.email,
        name: userData.name,
        account_type: userData.account_type,
      },
    });

    return response;
  } catch (error) {
    console.error("Error during sign-up:", error);

    res.json({ statusCode: 400, error: error.message });

    throw error;
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { email, password } = req.body;

  const clientId = "1t05m2f66hgpqiro4pps4hench";
  const clientSecret = "no8512l17qln74ltd11fbh55j80rgok0e9c77anqrhikebqe0l8";

  const secretHash = generateSecretHash(email, clientId, clientSecret);

  // Input for InitiateAuthCommand
  const input = {
    AuthFlow: "USER_PASSWORD_AUTH", // Set the authentication flow to user-password-based auth
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
    ClientId: "1t05m2f66hgpqiro4pps4hench", // Your Cognito app client ID
  };

  const command = new InitiateAuthCommand(input);

  try {
    // Send the authentication request
    const response = await client.send(command);

    // Check if the response contains an AuthenticationResult
    if (response.AuthenticationResult) {
      const token = response.AuthenticationResult.AccessToken;

      // Now, use the token to get the user attributes
      const getUserCommand = new GetUserCommand({ AccessToken: token });
      const userResponse = await client.send(getUserCommand);

      const userAttributes = userResponse.UserAttributes;

      // Send back the access token and user information
      res.status(200).send({
        statusCode: 200,
        user: userAttributes,
        accessToken: token,
      });
    } else {
      // Handle cases where a challenge response is required (like MFA)
      res.status(400).send({
        statusCode: 400,
        message: "Additional challenge required",
        challenge: response.ChallengeName,
        session: response.Session,
      });
    }
  } catch (error) {
    // Handle authentication errors
    res.status(401).send({
      statusCode: 401,
      error: error.message,
    });
  }
});

app.post("/api/v1/confirm_user", async (req, res) => {
  const { username, confirmationCode } = req.body;

  const clientId = "1t05m2f66hgpqiro4pps4hench";
  const clientSecret = "no8512l17qln74ltd11fbh55j80rgok0e9c77anqrhikebqe0l8";

  const secretHash = generateSecretHash(username, clientId, clientSecret);

  const input = {
    ClientId: clientId, // required, Cognito app client id
    SecretHash: secretHash, // required, computed secret hash
    Username: username, // required, from request body
    ConfirmationCode: confirmationCode, // required, from request body
    ForceAliasCreation: false, // set to true or false based on your use case
  };

  // Create the command
  const command = new ConfirmSignUpCommand(input);

  try {
    // Send the command to AWS Cognito
    const response = await client.send(command);

    // If successful, response will include confirmation details
    res.status(200).send({
      statusCode: 200,
      user: username,
      result: response,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(400).send({
      statusCode: 400,
      user: null,
      error: error.message,
    });
  }
});

app.post("/api/v1/apply", upload.single("resume"), async (req, res) => {
  const application = req.body;
  const resume = req.file; // This is how you get the uploaded file

  const fileStream = fs.createReadStream(
    path.join(__dirname, "/uploads/", resume.filename)
  );
  const uploadParams = {
    Bucket: "platepalsbucket",
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
        organizationId: application.organizationId,
        resumeKey: `resumes/${resume.filename}`,
      },
    };

    await ddbDocClient.send(new PutCommand(dbItem));

    const updateParams = {
      TableName: "PlatePals",
      Key: {
        id: parseInt(application.opportunityId),
        organizationId: application.organizationId,
      }, // replace 'id' with the actual primary key of your Opportunities table
      UpdateExpression: "SET applicants = applicants + :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await ddbDocClient.send(new UpdateCommand(updateParams));

    res.json({ message: "Application successfully created" });

    fs.unlink(path.join(__dirname, "/uploads/", resume.filename), (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.error("Error", err);
  }
});

app.post("/api/v1/opportunities", async (req, res) => {
  const opportunity = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

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

    res.status(200).json({ message: "Opportunity successfully created" });
  } catch (error) {
    console.error(`Failed to get location: ${error}`);
    res.json({ message: `Failed to create opportunity: ${error}` });
  }
});

// PUT ROUTES

app.put("/api/v1/applications/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedApplication = req.body;

  try {
    const dbItem = {
      TableName: "PlatePalsApplications",
      Key: {
        id,
        organizationId: updatedApplication.organizationId,
      },
      UpdateExpression: "SET reviewed = :status",
      ExpressionAttributeValues: {
        ":status": updatedApplication.reviewed,
      },
      ReturnValues: "ALL_NEW",
    };

    await ddbDocClient.send(new UpdateCommand(dbItem));

    res.json({ message: "Application successfully updated" });
  } catch (error) {
    res.json({ message: `Failed to update application: ${error}` });
  }
});

app.listen(8080, () => console.log("server listening on port 8080"));
