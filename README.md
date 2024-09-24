# PlatePals
PlatePals is a web platform designed to connect individuals with food-related volunteer opportunities. Think of it as "LinkedIn for Food Volunteers," where organizations and volunteers can engage and collaborate to help combat food insecurity and support food-related causes.

# 🚀 Live URL
[PlatePals Web App](https://main.d2ujx72xrafh9l.amplifyapp.com/)

# 🛠️ Technologies Used
This project leverages a wide range of AWS services and modern web technologies to provide a responsive and scalable solution:

**Frontend**:
React.js (with responsive design)
TailwindCSS
Toastify
Amplify (for frontend hosting and CI/CD)
**Backend**:
Node.js & Express.js (for building the RESTful API)
AWS App Runner (to run the backend services in the cloud)
AWS Infrastructure:
Amazon ECR (Elastic Container Registry to store Docker images)
AWS Amplify (for hosting and deploying the frontend)
Amazon S3 (for storing static assets)
Amazon DynamoDB (as the NoSQL database to manage volunteer opportunities and user data)
Amazon Cognito (for authentication and user management)
# 📚 Features
**Volunteer Matching**: Volunteers can browse and search food-related volunteer opportunities based on location and interest.
Organization Management: Organizations can post and manage volunteer opportunities.
**Responsive Design**: Fully responsive frontend to ensure seamless experience across devices.
Authentication: Secure login and sign-up via AWS Cognito.
**Data Storage**: Opportunities and user data stored in AWS DynamoDB for scalability and performance.
**Backend API**: Node.js/Express API for managing users, opportunities, and more.
# 💻 Local Development
**Prerequisites**
Node.js (v14+)
Docker (for building and running containerized services)
AWS CLI (for managing AWS services)
# Installation
Clone the repository:

bash
Copy code
git clone https://github.com/cyrusguest/platepals.git
cd platepals
Install the dependencies:

For the backend:

bash
Copy code
cd backend
npm install
For the frontend:

bash
Copy code
cd frontend
npm install
Set up environment variables:

Create a .env file in both the frontend and backend directories and populate it with your environment-specific configurations (e.g., AWS keys, database credentials, Cognito settings).

Run the backend locally:

bash
Copy code
cd backend
npm run dev
Run the frontend locally:

bash
Copy code
cd frontend
npm start
# 🚢 Deployment
**Backend**:
The backend is deployed via AWS App Runner, which automatically pulls the containerized image from Amazon ECR.

Build and push the Docker image:

bash
Copy code
docker build -t platepals-backend .
docker tag platepals-backend:latest 650251711292.dkr.ecr.us-east-1.amazonaws.com/platepals-backend:latest
docker push 650251711292.dkr.ecr.us-east-1.amazonaws.com/platepals-backend:latest
Deploy via App Runner: The App Runner service is configured to automatically pull from ECR and deploy updates to the backend.

**Frontend**:
The frontend is hosted via AWS Amplify, which automatically builds and deploys on every push to the main branch.

# 📂 Project Structure
graphql
Copy code
root
│
├── backend                 # Express.js API code
│   ├── src                 # API routes and controllers
│   ├── config              # Configurations (AWS services, DB connections)
│   └── .env.example        # Example environment variables for backend
│
├── frontend                # React.js frontend code
│   ├── src                 # Components and views
│   ├── public              # Public static files
│   └── .env.example        # Example environment variables for frontend
│
├── docker-compose.yml      # For local dev environment using Docker
└── README.md               # Project documentation

Feel free to customize this further based on specific details or functionality you want to highlight! If you need any adjustments, just let me know!
