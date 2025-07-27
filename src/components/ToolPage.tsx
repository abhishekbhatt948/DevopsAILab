import React, { useState } from 'react';
import { ArrowLeft, Book, Play, Terminal, Copy, ExternalLink, Search, Filter } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  steps: string[];
}

interface ToolPageProps {
  tool: Tool;
  onBack: () => void;
  onPlayground: (tool: Tool) => void;
}

const ToolPage: React.FC<ToolPageProps> = ({ tool, onBack, onPlayground }) => {
  const [activeTab, setActiveTab] = useState('learn');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toolContent = {
    docker: {
      learn: [
        {
          title: "Installation & Setup",
          content: `# Install Docker on Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
docker run hello-world`,
          category: "setup"
        },
        {
          title: "Basic Docker Commands",
          content: `# Image Management
docker images                    # List all images
docker pull nginx:latest         # Pull image from registry
docker rmi image_name           # Remove image
docker build -t myapp .         # Build image from Dockerfile
docker tag myapp:latest myapp:v1.0  # Tag image

# Container Management
docker ps                       # List running containers
docker ps -a                    # List all containers
docker run -d --name web nginx  # Run container in background
docker start container_name     # Start stopped container
docker stop container_name      # Stop running container
docker restart container_name   # Restart container
docker rm container_name        # Remove container
docker exec -it container_name bash  # Execute command in container

# Container Inspection
docker logs container_name      # View container logs
docker inspect container_name   # Detailed container info
docker stats                    # Real-time resource usage`,
          category: "basics"
        },
        {
          title: "Dockerfile Best Practices",
          content: `# Multi-stage Dockerfile example
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["npm", "start"]

# Best Practices:
# 1. Use specific tags, not 'latest'
# 2. Minimize layers by combining RUN commands
# 3. Use .dockerignore to exclude unnecessary files
# 4. Run as non-root user
# 5. Use multi-stage builds for smaller images
# 6. Order instructions by frequency of change`,
          category: "advanced"
        },
        {
          title: "Docker Compose",
          content: `# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:

# Docker Compose Commands
docker-compose up -d            # Start services in background
docker-compose down             # Stop and remove containers
docker-compose logs web         # View service logs
docker-compose exec web bash    # Execute command in service
docker-compose build            # Build services
docker-compose ps               # List running services`,
          category: "compose"
        },
        {
          title: "Networking & Volumes",
          content: `# Docker Networks
docker network ls               # List networks
docker network create mynet     # Create custom network
docker network inspect mynet    # Inspect network
docker run --network mynet nginx  # Run container on network

# Docker Volumes
docker volume ls                # List volumes
docker volume create myvolume   # Create volume
docker volume inspect myvolume  # Inspect volume
docker run -v myvolume:/data nginx  # Mount volume

# Bind Mounts
docker run -v /host/path:/container/path nginx

# Volume Management
docker volume prune             # Remove unused volumes
docker system prune -a          # Clean up everything`,
          category: "networking"
        }
      ],
      commands: [
        "docker --version",
        "docker info",
        "docker images",
        "docker ps",
        "docker ps -a",
        "docker pull nginx",
        "docker run hello-world",
        "docker run -d --name web nginx",
        "docker stop web",
        "docker start web",
        "docker restart web",
        "docker rm web",
        "docker rmi nginx",
        "docker exec -it web bash",
        "docker logs web",
        "docker inspect web",
        "docker stats",
        "docker build -t myapp .",
        "docker tag myapp:latest myapp:v1.0",
        "docker push myapp:v1.0",
        "docker network ls",
        "docker network create mynet",
        "docker volume ls",
        "docker volume create myvolume",
        "docker-compose up -d",
        "docker-compose down",
        "docker-compose logs",
        "docker-compose build",
        "docker-compose ps",
        "docker system prune",
        "docker volume prune",
        "docker image prune"
      ]
    },
    kubernetes: {
      learn: [
        {
          title: "Kubernetes Setup",
          content: `# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install minikube for local development
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube /usr/local/bin/

# Start minikube cluster
minikube start --driver=docker
minikube status

# Configure kubectl context
kubectl config current-context
kubectl config get-contexts
kubectl cluster-info`,
          category: "setup"
        },
        {
          title: "Pods and Deployments",
          content: `# Create a simple pod
kubectl run nginx --image=nginx --port=80

# Create deployment
kubectl create deployment web --image=nginx --replicas=3

# Scale deployment
kubectl scale deployment web --replicas=5

# Update deployment image
kubectl set image deployment/web nginx=nginx:1.20

# Rollback deployment
kubectl rollout undo deployment/web

# Check rollout status
kubectl rollout status deployment/web

# View deployment history
kubectl rollout history deployment/web

# Delete resources
kubectl delete pod nginx
kubectl delete deployment web`,
          category: "workloads"
        },
        {
          title: "Services and Networking",
          content: `# Create service to expose deployment
kubectl expose deployment web --port=80 --type=ClusterIP

# Create LoadBalancer service
kubectl expose deployment web --port=80 --type=LoadBalancer

# Create NodePort service
kubectl expose deployment web --port=80 --type=NodePort

# Port forwarding for local access
kubectl port-forward service/web 8080:80

# View service endpoints
kubectl get endpoints web

# Service discovery
kubectl get svc
kubectl describe svc web

# Ingress example
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: myapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80`,
          category: "networking"
        },
        {
          title: "ConfigMaps and Secrets",
          content: `# Create ConfigMap from literal values
kubectl create configmap app-config --from-literal=database_url=postgres://localhost:5432/mydb

# Create ConfigMap from file
kubectl create configmap app-config --from-file=config.properties

# Create Secret
kubectl create secret generic app-secret --from-literal=password=mysecretpassword

# Create TLS Secret
kubectl create secret tls tls-secret --cert=tls.crt --key=tls.key

# Use ConfigMap in Pod
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: myapp
    env:
    - name: DATABASE_URL
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_url
    - name: PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: password

# View ConfigMaps and Secrets
kubectl get configmaps
kubectl get secrets
kubectl describe configmap app-config`,
          category: "configuration"
        },
        {
          title: "Persistent Volumes",
          content: `# Create PersistentVolume
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-storage
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /data

# Create PersistentVolumeClaim
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-storage
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: manual

# Use PVC in Pod
apiVersion: v1
kind: Pod
metadata:
  name: app-with-storage
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: storage
      mountPath: /data
  volumes:
  - name: storage
    persistentVolumeClaim:
      claimName: pvc-storage

# Storage commands
kubectl get pv
kubectl get pvc
kubectl describe pv pv-storage`,
          category: "storage"
        }
      ],
      commands: [
        "kubectl version",
        "kubectl cluster-info",
        "kubectl get nodes",
        "kubectl get pods",
        "kubectl get deployments",
        "kubectl get services",
        "kubectl get ingress",
        "kubectl get configmaps",
        "kubectl get secrets",
        "kubectl get pv",
        "kubectl get pvc",
        "kubectl create deployment nginx --image=nginx",
        "kubectl scale deployment nginx --replicas=3",
        "kubectl expose deployment nginx --port=80",
        "kubectl port-forward service/nginx 8080:80",
        "kubectl logs deployment/nginx",
        "kubectl describe pod nginx",
        "kubectl exec -it nginx-pod -- bash",
        "kubectl apply -f deployment.yaml",
        "kubectl delete -f deployment.yaml",
        "kubectl rollout status deployment/nginx",
        "kubectl rollout undo deployment/nginx",
        "kubectl create configmap app-config --from-literal=key=value",
        "kubectl create secret generic app-secret --from-literal=password=secret",
        "kubectl get events",
        "kubectl top nodes",
        "kubectl top pods"
      ]
    },
    jenkins: {
      learn: [
        {
          title: "Jenkins Installation",
          content: `# Install Jenkins on Ubuntu
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins

# Start Jenkins service
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Install using Docker
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts

# Access Jenkins at http://localhost:8080`,
          category: "setup"
        },
        {
          title: "Pipeline Basics",
          content: `// Declarative Pipeline
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '16'
        APP_NAME = 'myapp'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/user/repo.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results.xml'
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run deploy'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}`,
          category: "pipelines"
        },
        {
          title: "Jenkins CLI",
          content: `# Download Jenkins CLI
wget http://localhost:8080/jnlpJars/jenkins-cli.jar

# Create API token in Jenkins UI: Manage Jenkins > Configure Global Security

# Basic CLI commands
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token help

# Build job
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token build job-name

# List jobs
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token list-jobs

# Get job info
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token get-job job-name

# Create job from XML
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token create-job new-job < job-config.xml

# Install plugin
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token install-plugin plugin-name

# Restart Jenkins
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token restart`,
          category: "cli"
        },
        {
          title: "Multi-branch Pipelines",
          content: `// Jenkinsfile for multi-branch pipeline
pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod'], description: 'Target environment')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip test execution')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            parallel {
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
                stage('Backend') {
                    steps {
                        dir('backend') {
                            sh 'mvn clean compile'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            when {
                not { params.SKIP_TESTS }
            }
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    if (params.ENVIRONMENT == 'prod') {
                        input message: 'Deploy to production?', ok: 'Deploy'
                    }
                    sh "kubectl apply -f k8s/${params.ENVIRONMENT}/"
                }
            }
        }
    }
}`,
          category: "advanced"
        },
        {
          title: "Plugin Management",
          content: `# Essential Jenkins Plugins:

# 1. Pipeline Plugins
- Pipeline
- Pipeline: Stage View
- Blue Ocean (modern UI)

# 2. Source Control
- Git
- GitHub
- GitLab

# 3. Build Tools
- Maven Integration
- Gradle
- NodeJS

# 4. Deployment
- Deploy to container
- Kubernetes
- AWS Steps

# 5. Notifications
- Email Extension
- Slack Notification
- Microsoft Teams

# Install plugins via CLI
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token install-plugin git
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token install-plugin pipeline-stage-view
java -jar jenkins-cli.jar -s http://localhost:8080 -auth username:token install-plugin blueocean

# Plugin management in Jenkinsfile
@Library('shared-library@main') _

pipeline {
    agent any
    tools {
        nodejs '16'
        maven '3.8'
    }
    // ... rest of pipeline
}`,
          category: "plugins"
        }
      ],
      commands: [
        "sudo systemctl start jenkins",
        "sudo systemctl stop jenkins",
        "sudo systemctl restart jenkins",
        "sudo systemctl status jenkins",
        "sudo cat /var/lib/jenkins/secrets/initialAdminPassword",
        "java -jar jenkins-cli.jar help",
        "java -jar jenkins-cli.jar list-jobs",
        "java -jar jenkins-cli.jar build job-name",
        "java -jar jenkins-cli.jar console job-name",
        "java -jar jenkins-cli.jar install-plugin plugin-name",
        "java -jar jenkins-cli.jar restart",
        "docker run -d --name jenkins -p 8080:8080 jenkins/jenkins:lts",
        "docker exec -it jenkins bash",
        "docker logs jenkins"
      ]
    },
    terraform: {
      learn: [
        {
          title: "Terraform Installation & Setup",
          content: `# Install Terraform on Linux
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verify installation
terraform version

# Initialize Terraform project
terraform init

# Validate configuration
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure
terraform destroy

# Format code
terraform fmt

# Show current state
terraform show`,
          category: "setup"
        },
        {
          title: "Basic Terraform Configuration",
          content: `# main.tf - Basic AWS EC2 instance
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  
  tags = {
    Name        = "WebServer"
    Environment = var.environment
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

# outputs.tf
output "instance_ip" {
  description = "Public IP of the instance"
  value       = aws_instance.web.public_ip
}`,
          category: "basics"
        },
        {
          title: "State Management",
          content: `# Remote State Configuration
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# State Commands
terraform state list                    # List resources in state
terraform state show aws_instance.web   # Show specific resource
terraform state mv old_name new_name    # Rename resource in state
terraform state rm aws_instance.web     # Remove resource from state
terraform state pull                    # Download remote state
terraform state push                    # Upload state to remote

# Import existing resources
terraform import aws_instance.web i-1234567890abcdef0

# Workspace management
terraform workspace list                # List workspaces
terraform workspace new prod           # Create new workspace
terraform workspace select prod        # Switch workspace
terraform workspace delete dev         # Delete workspace

# State locking with DynamoDB
resource "aws_dynamodb_table" "terraform_locks" {
  name           = "terraform-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
}`,
          category: "state"
        },
        {
          title: "Modules",
          content: `# Module structure
modules/
  vpc/
    main.tf
    variables.tf
    outputs.tf
  ec2/
    main.tf
    variables.tf
    outputs.tf

# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = var.name
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnets)
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.name}-public-${count.index + 1}"
  }
}

# modules/vpc/variables.tf
variable "name" {
  description = "Name prefix for resources"
  type        = string
}

variable "cidr_block" {
  description = "CIDR block for VPC"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
}

# modules/vpc/outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = aws_subnet.public[*].id
}

# Using the module in main.tf
module "vpc" {
  source = "./modules/vpc"
  
  name           = "my-vpc"
  cidr_block     = "10.0.0.0/16"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
}

module "web_server" {
  source = "./modules/ec2"
  
  vpc_id    = module.vpc.vpc_id
  subnet_id = module.vpc.public_subnet_ids[0]
}`,
          category: "modules"
        },
        {
          title: "Advanced Features",
          content: `# Conditional Resources
resource "aws_instance" "web" {
  count = var.create_instance ? 1 : 0
  
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
}

# For Each
resource "aws_instance" "web" {
  for_each = var.instances
  
  ami           = data.aws_ami.ubuntu.id
  instance_type = each.value.instance_type
  
  tags = {
    Name = each.key
  }
}

variable "instances" {
  type = map(object({
    instance_type = string
  }))
  default = {
    web1 = { instance_type = "t3.micro" }
    web2 = { instance_type = "t3.small" }
  }
}

# Dynamic Blocks
resource "aws_security_group" "web" {
  name_prefix = "web-sg"
  
  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}

# Locals
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
  
  instance_name = "${var.project_name}-${var.environment}-web"
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  
  tags = merge(local.common_tags, {
    Name = local.instance_name
  })
}`,
          category: "advanced"
        }
      ],
      commands: [
        "terraform version",
        "terraform init",
        "terraform validate",
        "terraform plan",
        "terraform apply",
        "terraform destroy",
        "terraform fmt",
        "terraform show",
        "terraform output",
        "terraform state list",
        "terraform state show resource_name",
        "terraform state mv old_name new_name",
        "terraform state rm resource_name",
        "terraform import resource_name resource_id",
        "terraform workspace list",
        "terraform workspace new workspace_name",
        "terraform workspace select workspace_name",
        "terraform refresh",
        "terraform graph",
        "terraform providers",
        "terraform console"
      ]
    },
    ansible: {
      learn: [
        {
          title: "Ansible Installation & Setup",
          content: `# Install Ansible on Ubuntu
sudo apt update
sudo apt install ansible

# Install via pip
pip3 install ansible

# Verify installation
ansible --version

# Create inventory file
echo "[webservers]" > inventory.ini
echo "server1 ansible_host=192.168.1.10" >> inventory.ini
echo "server2 ansible_host=192.168.1.11" >> inventory.ini

# Test connectivity
ansible all -i inventory.ini -m ping

# Create ansible.cfg
[defaults]
inventory = inventory.ini
remote_user = ubuntu
private_key_file = ~/.ssh/id_rsa
host_key_checking = False`,
          category: "setup"
        },
        {
          title: "Inventory Management",
          content: `# Static Inventory (inventory.ini)
[webservers]
web1 ansible_host=192.168.1.10 ansible_user=ubuntu
web2 ansible_host=192.168.1.11 ansible_user=ubuntu

[databases]
db1 ansible_host=192.168.1.20 ansible_user=ubuntu

[production:children]
webservers
databases

[production:vars]
ansible_ssh_private_key_file=~/.ssh/prod_key
environment=production

# Dynamic Inventory (AWS)
# Install boto3: pip install boto3
# Create aws_ec2.yml
plugin: aws_ec2
regions:
  - us-west-2
keyed_groups:
  - key: tags
    prefix: tag
  - key: instance_type
    prefix: type
hostnames:
  - dns-name
  - private-ip-address

# Use dynamic inventory
ansible-inventory -i aws_ec2.yml --list
ansible all -i aws_ec2.yml -m ping

# Group variables
# group_vars/webservers.yml
nginx_port: 80
ssl_enabled: true

# host_vars/web1.yml
server_role: primary
backup_enabled: true`,
          category: "inventory"
        },
        {
          title: "Playbooks",
          content: `# Basic Playbook (site.yml)
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    packages:
      - nginx
      - git
      - curl
    
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes
        cache_valid_time: 3600
    
    - name: Install packages
      package:
        name: "{{ packages }}"
        state: present
    
    - name: Start and enable nginx
      systemd:
        name: nginx
        state: started
        enabled: yes
    
    - name: Copy nginx config
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        backup: yes
      notify: restart nginx
    
    - name: Create web directory
      file:
        path: /var/www/html
        state: directory
        owner: www-data
        group: www-data
        mode: '0755'
  
  handlers:
    - name: restart nginx
      systemd:
        name: nginx
        state: restarted

# Run playbook
ansible-playbook -i inventory.ini site.yml

# Check syntax
ansible-playbook --syntax-check site.yml

# Dry run
ansible-playbook --check site.yml

# Run specific tags
ansible-playbook --tags "nginx" site.yml`,
          category: "playbooks"
        },
        {
          title: "Roles",
          content: `# Create role structure
ansible-galaxy init nginx

# Role structure
roles/
  nginx/
    tasks/main.yml
    handlers/main.yml
    templates/
    files/
    vars/main.yml
    defaults/main.yml
    meta/main.yml

# roles/nginx/tasks/main.yml
---
- name: Install nginx
  package:
    name: nginx
    state: present

- name: Configure nginx
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: restart nginx

- name: Start nginx service
  systemd:
    name: nginx
    state: started
    enabled: yes

# roles/nginx/handlers/main.yml
---
- name: restart nginx
  systemd:
    name: nginx
    state: restarted

# roles/nginx/defaults/main.yml
---
nginx_port: 80
nginx_user: www-data
nginx_worker_processes: auto

# roles/nginx/meta/main.yml
---
dependencies:
  - role: common
    vars:
      packages:
        - curl
        - wget

# Use role in playbook
---
- name: Configure web servers
  hosts: webservers
  become: yes
  roles:
    - common
    - nginx
    - { role: ssl, when: ssl_enabled }

# Install roles from Ansible Galaxy
ansible-galaxy install geerlingguy.nginx
ansible-galaxy install -r requirements.yml

# requirements.yml
---
- name: geerlingguy.nginx
  version: 3.1.4
- name: geerlingguy.mysql
  version: 4.3.4`,
          category: "roles"
        },
        {
          title: "Advanced Features",
          content: `# Vault for secrets
# Create encrypted file
ansible-vault create secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Decrypt file
ansible-vault decrypt vars.yml

# Use vault in playbook
ansible-playbook --ask-vault-pass site.yml

# Vault password file
echo "mypassword" > .vault_pass
ansible-playbook --vault-password-file .vault_pass site.yml

# Conditionals and Loops
- name: Install packages
  package:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - git
    - curl
  when: ansible_os_family == "Debian"

# Register variables
- name: Check if nginx is running
  command: systemctl is-active nginx
  register: nginx_status
  ignore_errors: yes

- name: Start nginx if not running
  systemd:
    name: nginx
    state: started
  when: nginx_status.rc != 0

# Blocks and error handling
- block:
    - name: Install package
      package:
        name: nginx
        state: present
    - name: Start service
      systemd:
        name: nginx
        state: started
  rescue:
    - name: Print error message
      debug:
        msg: "Failed to install and start nginx"
  always:
    - name: Check service status
      command: systemctl status nginx

# Custom facts
- name: Set custom fact
  set_fact:
    deployment_time: "{{ ansible_date_time.iso8601 }}"

# Delegate tasks
- name: Update load balancer
  uri:
    url: "http://{{ lb_server }}/api/update"
    method: POST
  delegate_to: localhost
  run_once: true`,
          category: "advanced"
        }
      ],
      commands: [
        "ansible --version",
        "ansible all -m ping",
        "ansible all -m setup",
        "ansible webservers -m command -a 'uptime'",
        "ansible all -m copy -a 'src=/etc/hosts dest=/tmp/hosts'",
        "ansible all -m file -a 'dest=/tmp/test state=touch'",
        "ansible all -m service -a 'name=nginx state=started'",
        "ansible-playbook site.yml",
        "ansible-playbook --syntax-check site.yml",
        "ansible-playbook --check site.yml",
        "ansible-playbook --list-tasks site.yml",
        "ansible-playbook --list-hosts site.yml",
        "ansible-galaxy init role_name",
        "ansible-galaxy install geerlingguy.nginx",
        "ansible-vault create secrets.yml",
        "ansible-vault edit secrets.yml",
        "ansible-vault encrypt file.yml",
        "ansible-vault decrypt file.yml",
        "ansible-inventory --list",
        "ansible-config dump"
      ]
    },
    helm: {
      learn: [
        {
          title: "Helm Installation & Setup",
          content: `# Install Helm on Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install specific version
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh --version v3.12.0

# Verify installation
helm version

# Add official stable repository
helm repo add stable https://charts.helm.sh/stable
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# List repositories
helm repo list

# Search for charts
helm search repo nginx
helm search hub wordpress`,
          category: "setup"
        },
        {
          title: "Chart Management",
          content: `# Create new chart
helm create mychart

# Chart structure
mychart/
  Chart.yaml          # Chart metadata
  values.yaml         # Default configuration values
  charts/             # Chart dependencies
  templates/          # Kubernetes manifests
    deployment.yaml
    service.yaml
    ingress.yaml
    _helpers.tpl      # Template helpers

# Install chart
helm install myrelease ./mychart

# Install from repository
helm install myrelease bitnami/nginx

# Install with custom values
helm install myrelease ./mychart --values custom-values.yaml
helm install myrelease ./mychart --set image.tag=v2.0

# Upgrade release
helm upgrade myrelease ./mychart
helm upgrade myrelease ./mychart --set replicas=3

# Rollback release
helm rollback myrelease 1

# Uninstall release
helm uninstall myrelease

# List releases
helm list
helm list --all-namespaces`,
          category: "charts"
        },
        {
          title: "Chart Development",
          content: `# Chart.yaml
apiVersion: v2
name: webapp
description: A Helm chart for web application
type: application
version: 0.1.0
appVersion: "1.0.0"
dependencies:
  - name: postgresql
    version: 11.x.x
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled

# values.yaml
replicaCount: 3

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "1.20"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "webapp.fullname" . }}
  labels:
    {{- include "webapp.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "webapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "webapp.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          resources:
            {{- toYaml .Values.resources | nindent 12 }}

# Validate chart
helm lint ./mychart

# Template rendering
helm template myrelease ./mychart

# Package chart
helm package ./mychart`,
          category: "development"
        },
        {
          title: "Dependencies & Hooks",
          content: `# Chart dependencies in Chart.yaml
dependencies:
  - name: postgresql
    version: "11.9.13"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
  - name: redis
    version: "17.3.7"
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled

# Update dependencies
helm dependency update

# Build dependencies
helm dependency build

# List dependencies
helm dependency list

# Pre-install hook
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ include "webapp.fullname" . }}-migration"
  annotations:
    "helm.sh/hook": pre-install,pre-upgrade
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migration
        image: migrate/migrate
        command: ['migrate', '-path', '/migrations', '-database', 'postgres://...', 'up']

# Post-install hook
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "webapp.fullname" . }}-test"
  annotations:
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "1"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  restartPolicy: Never
  containers:
  - name: test
    image: busybox
    command: ['wget', '--spider', 'http://{{ include "webapp.fullname" . }}']

# Available hooks:
# pre-install, post-install
# pre-delete, post-delete
# pre-upgrade, post-upgrade
# pre-rollback, post-rollback
# test`,
          category: "hooks"
        },
        {
          title: "Advanced Features",
          content: `# Conditional templates
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "webapp.fullname" . }}
spec:
  # ingress spec
{{- end }}

# Loops in templates
{{- range .Values.ingress.hosts }}
  - host: {{ .host | quote }}
    http:
      paths:
        {{- range .paths }}
        - path: {{ .path }}
          pathType: {{ .pathType }}
          backend:
            service:
              name: {{ include "webapp.fullname" $ }}
              port:
                number: {{ $.Values.service.port }}
        {{- end }}
{{- end }}

# Template functions
# String functions
{{ .Values.image.repository | upper }}
{{ .Values.image.tag | default "latest" }}
{{ .Values.name | trunc 63 | trimSuffix "-" }}

# Type conversion
{{ .Values.port | toString }}
{{ .Values.enabled | ternary "yes" "no" }}

# Date functions
{{ now | date "2006-01-02" }}

# Encoding functions
{{ .Values.config | toYaml | indent 2 }}
{{ .Values.secret | b64enc }}

# Custom values files
# values-dev.yaml
environment: development
replicas: 1
resources:
  requests:
    memory: "64Mi"
    cpu: "50m"

# values-prod.yaml
environment: production
replicas: 5
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"

# Install with specific values
helm install myapp ./mychart -f values-prod.yaml

# Helm tests
# templates/tests/connection.yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "webapp.fullname" . }}-test-connection"
  annotations:
    "helm.sh/hook": test
spec:
  restartPolicy: Never
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "webapp.fullname" . }}:{{ .Values.service.port }}']

# Run tests
helm test myrelease`,
          category: "advanced"
        }
      ],
      commands: [
        "helm version",
        "helm repo add bitnami https://charts.bitnami.com/bitnami",
        "helm repo update",
        "helm repo list",
        "helm search repo nginx",
        "helm search hub wordpress",
        "helm create mychart",
        "helm install myrelease ./mychart",
        "helm install myrelease bitnami/nginx",
        "helm list",
        "helm status myrelease",
        "helm upgrade myrelease ./mychart",
        "helm rollback myrelease 1",
        "helm uninstall myrelease",
        "helm lint ./mychart",
        "helm template myrelease ./mychart",
        "helm package ./mychart",
        "helm dependency update",
        "helm test myrelease",
        "helm get values myrelease",
        "helm get manifest myrelease",
        "helm history myrelease"
      ]
    },
    aws: {
      learn: [
        {
          title: "AWS CLI Setup",
          content: `# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version

# Configure AWS CLI
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-west-2
# Default output format: json

# Configure with profiles
aws configure --profile production
aws configure --profile development

# Use specific profile
aws s3 ls --profile production

# Set environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-west-2

# List configurations
aws configure list
aws configure list-profiles`,
          category: "setup"
        },
        {
          title: "EC2 Management",
          content: `# List EC2 instances
aws ec2 describe-instances

# List instances with specific state
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"

# Launch new instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.micro \
  --key-name my-key-pair \
  --security-group-ids sg-12345678 \
  --subnet-id subnet-12345678

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Create security group
aws ec2 create-security-group \
  --group-name my-sg \
  --description "My security group"

# Add rule to security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Create key pair
aws ec2 create-key-pair --key-name my-key-pair --query 'KeyMaterial' --output text > my-key-pair.pem
chmod 400 my-key-pair.pem

# List AMIs
aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn2-ami-hvm-*"`,
          category: "ec2"
        },
        {
          title: "S3 Operations",
          content: `# List buckets
aws s3 ls

# List objects in bucket
aws s3 ls s3://my-bucket/

# Create bucket
aws s3 mb s3://my-unique-bucket-name

# Remove bucket
aws s3 rb s3://my-bucket --force

# Copy file to S3
aws s3 cp file.txt s3://my-bucket/

# Copy from S3
aws s3 cp s3://my-bucket/file.txt ./

# Sync directory to S3
aws s3 sync ./local-folder s3://my-bucket/remote-folder

# Sync from S3
aws s3 sync s3://my-bucket/remote-folder ./local-folder

# Set bucket policy
aws s3api put-bucket-policy --bucket my-bucket --policy file://policy.json

# Enable versioning
aws s3api put-bucket-versioning --bucket my-bucket --versioning-configuration Status=Enabled

# Enable static website hosting
aws s3api put-bucket-website --bucket my-bucket --website-configuration file://website.json

# Set bucket CORS
aws s3api put-bucket-cors --bucket my-bucket --cors-configuration file://cors.json

# Generate presigned URL
aws s3 presign s3://my-bucket/file.txt --expires-in 3600`,
          category: "s3"
        },
        {
          title: "IAM Management",
          content: `# List users
aws iam list-users

# Create user
aws iam create-user --user-name john

# Delete user
aws iam delete-user --user-name john

# Create access key
aws iam create-access-key --user-name john

# Delete access key
aws iam delete-access-key --user-name john --access-key-id AKIAIOSFODNN7EXAMPLE

# List groups
aws iam list-groups

# Create group
aws iam create-group --group-name developers

# Add user to group
aws iam add-user-to-group --user-name john --group-name developers

# List policies
aws iam list-policies --scope Local

# Create policy
aws iam create-policy --policy-name MyPolicy --policy-document file://policy.json

# Attach policy to user
aws iam attach-user-policy --user-name john --policy-arn arn:aws:iam::123456789012:policy/MyPolicy

# Attach policy to group
aws iam attach-group-policy --group-name developers --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# List roles
aws iam list-roles

# Create role
aws iam create-role --role-name MyRole --assume-role-policy-document file://trust-policy.json

# Attach policy to role
aws iam attach-role-policy --role-name MyRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess`,
          category: "iam"
        },
        {
          title: "CloudFormation",
          content: `# List stacks
aws cloudformation list-stacks

# Create stack
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-body file://template.yaml \
  --parameters ParameterKey=KeyName,ParameterValue=my-key

# Update stack
aws cloudformation update-stack \
  --stack-name my-stack \
  --template-body file://template.yaml

# Delete stack
aws cloudformation delete-stack --stack-name my-stack

# Describe stack
aws cloudformation describe-stacks --stack-name my-stack

# List stack resources
aws cloudformation list-stack-resources --stack-name my-stack

# Get stack events
aws cloudformation describe-stack-events --stack-name my-stack

# Validate template
aws cloudformation validate-template --template-body file://template.yaml

# Create change set
aws cloudformation create-change-set \
  --stack-name my-stack \
  --change-set-name my-changeset \
  --template-body file://template.yaml

# Execute change set
aws cloudformation execute-change-set \
  --change-set-name my-changeset \
  --stack-name my-stack

# Sample CloudFormation template
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Simple EC2 instance'
Parameters:
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: Name of an existing EC2 KeyPair
Resources:
  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c02fb55956c7d316
      InstanceType: t3.micro
      KeyName: !Ref KeyName
      SecurityGroups:
        - !Ref InstanceSecurityGroup
  InstanceSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Enable SSH access
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0
Outputs:
  InstanceId:
    Description: InstanceId of the newly created EC2 instance
    Value: !Ref EC2Instance`,
          category: "cloudformation"
        }
      ],
      commands: [
        "aws --version",
        "aws configure",
        "aws configure list",
        "aws sts get-caller-identity",
        "aws ec2 describe-instances",
        "aws ec2 describe-images --owners amazon",
        "aws s3 ls",
        "aws s3 mb s3://my-bucket",
        "aws s3 cp file.txt s3://my-bucket/",
        "aws s3 sync ./folder s3://my-bucket/",
        "aws iam list-users",
        "aws iam create-user --user-name john",
        "aws iam list-policies",
        "aws cloudformation list-stacks",
        "aws cloudformation create-stack --stack-name test --template-body file://template.yaml",
        "aws logs describe-log-groups",
        "aws rds describe-db-instances",
        "aws lambda list-functions",
        "aws eks list-clusters",
        "aws ecr describe-repositories"
      ]
    }
  };

  const currentContent = toolContent[tool.id as keyof typeof toolContent];
  const filteredContent = currentContent?.learn.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = currentContent?.learn ? 
    ['all', ...Array.from(new Set(currentContent.learn.map(item => item.category)))] : ['all'];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <tool.icon className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{tool.name}</h1>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onPlayground(tool)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Playground</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('learn')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'learn'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Book className="w-4 h-4 inline mr-2" />
              Learn
            </button>
            <button
              onClick={() => setActiveTab('commands')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'commands'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Terminal className="w-4 h-4 inline mr-2" />
              Commands
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'learn' && (
          <div>
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Learning Content */}
            <div className="space-y-6">
              {filteredContent.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.content)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                      {item.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'commands' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Essential {tool.name} Commands
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentContent?.commands.map((command, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <code className="text-sm font-mono text-gray-800 flex-1">
                    {command}
                  </code>
                  <button
                    onClick={() => copyToClipboard(command)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy command"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolPage;