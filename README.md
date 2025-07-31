# 🚀 Full CI/CD DevSecOps Pipeline for Node.js App on AWS ECS

This project demonstrates an end-to-end DevOps pipeline with DevSecOps practices for deploying a containerized Node.js application to AWS ECS using GitHub Actions and Terraform.

---

## 🔧 Tech Stack

- **Frontend**: Node.js, Vite, NGINX
- **CI/CD**: GitHub Actions
- **DevSecOps Tools**: ESLint, `npm audit`, Trivy
- **Containerization**: Docker (Multi-stage build)
- **Cloud Provider**: AWS
- **Infrastructure as Code**: Terraform
- **Services Used**: ECS (Fargate), ALB, ECR, S3, IAM, DynamoDB, CloudWatch

---

## 🧱 Project Architecture

📦 Node.js + Vite App
├── Dockerfile (multi-stage: Vite → NGINX)
├── .github/workflows/deploy.yml (CI/CD)
├── Terraform/
│ ├── vpc.tf
│ ├── ecs.tf
│ ├── alb.tf
│ ├── iam.tf
│ └── backend.tf (S3 + DynamoDB)
└── k8s/ (Optional for EKS deployment)


---

## ⚙️ Features

- ✅ Dockerized Vite-based frontend with NGINX server
- ✅ GitHub Actions pipeline with:
  - Linting (`eslint`)
  - Vulnerability scanning (`npm audit`, Trivy)
  - Docker build & push to DockerHub + ECR
- ✅ Terraform to provision:
  - VPC (public/private subnets)
  - ECS Cluster (Fargate)
  - Application Load Balancer
  - IAM roles/policies
  - S3 and DynamoDB for backend resources
- ✅ Application deployment on ECS with ALB-based traffic distribution

---

## 🛠️ Setup Instructions

### 1. Clone the repository
bash
git clone https://github.com/abhishekbhatt948/devops-ecs-node-app.git
cd devops-ecs-node-app
2. Set up environment
Configure AWS CLI

Create S3 bucket and DynamoDB table for Terraform backend

Push Docker image manually or via GitHub Actions

3. Terraform Apply
cd Terraform
terraform init
terraform apply

GitHub Actions CI: --

name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  IMAGE_NAME: devopsailab
  IMAGE_TAG: latest

jobs:
  build-and-scan:
    runs-on: ubuntu-latest
    name: Build, Lint, Test, and Scan

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm ci

      # - name: Run Linter
      #   run: npm run lint

      - name: Run Unit Tests
        run: npm test

      - name: Snyk Scan - Dependencies
        uses: snyk/actions/node@master
        with:
          command: test
          args: --severity-threshold=high
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  docker-build-and-push:
    runs-on: ubuntu-latest
    name: Build Docker and Push
    needs: build-and-scan

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker Image
        run: |
          docker build -t $IMAGE_NAME:$IMAGE_TAG .

      - name: Snyk Scan - Prod Dependencies Only (High+)
        uses: snyk/actions/node@master
        with:
          command: test
          args: --severity-threshold=high --dev=false
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      #---- Option A: DockerHub Push ----
      - name: DockerHub Login
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: DockerHub Push Image
        run: |
          docker tag $IMAGE_NAME:$IMAGE_TAG ${{ secrets.DOCKER_USERNAME }}/$IMAGE_NAME:$IMAGE_TAG
          docker push ${{ secrets.DOCKER_USERNAME }}/$IMAGE_NAME:$IMAGE_TAG

      # ---- Option B: AWS ECR Push ----
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1  

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Create ECR Repository if not exists
        run: |
          aws ecr describe-repositories --repository-names $IMAGE_NAME || \
          aws ecr create-repository --repository-name $IMAGE_NAME

      - name: Push to AWS ECR
        run: |
          ECR_REPO_URI=${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/$IMAGE_NAME
          docker tag $IMAGE_NAME:$IMAGE_TAG $ECR_REPO_URI:$IMAGE_TAG
          docker push $ECR_REPO_URI:$IMAGE_TAG

🌐 Application Access
Once deployed, the application can be accessed via the Application Load Balancer DNS:
http://your-alb-dns.amazonaws.com/  

📄 License
This project is licensed under the MIT License.

👤 Author
Abhishek Bhatt
DevOps & AWS Cloud Engineer
LinkedIn • GitHub • Portfolio
