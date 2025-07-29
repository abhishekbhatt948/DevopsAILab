import React, { useState } from 'react';
import { Play, Copy, Download, Upload, Settings, Terminal, Code, FileText } from 'lucide-react';

interface PlaygroundProps {
  tool: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    description: string;
  };
  onBack: () => void;
}

const Playground: React.FC<PlaygroundProps> = ({ tool, onBack }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [selectedExample, setSelectedExample] = useState('');

  const examples = {
    docker: [
      {
        name: 'Basic Node.js App',
        code: `# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production`
      },
      {
        name: 'Python Flask App',
        code: `# Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]

# requirements.txt
Flask==2.3.2
gunicorn==20.1.0

# app.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, Docker!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`
      },
      {
        name: 'Microservices Stack',
        code: `# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`
      }
    ],
    kubernetes: [
      {
        name: 'Basic Web App',
        code: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: nginx:1.20
        ports:
        - containerPort: 80

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer`
      },
      {
        name: 'Database with Persistent Storage',
        code: `# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13
        env:
        - name: POSTGRES_DB
          value: mydb
        - name: POSTGRES_USER
          value: user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc

---
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi`
      },
      {
        name: 'Web App with Ingress',
        code: `# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-app-service
            port:
              number: 80

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://user:pass@postgres:5432/mydb"
  redis_url: "redis://redis:6379"
  
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  api_key: YWJjZGVmZ2hpams= # base64 encoded`
      }
    ],
    jenkins: [
      {
        name: 'Basic CI Pipeline',
        code: `pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/app.git'
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
        }
        
        stage('Deploy') {
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
}`
      },
      {
        name: 'Docker Build Pipeline',
        code: `pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'myapp'
        IMAGE_TAG = "\\$\{BUILD_NUMBER\}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/app.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("\\$\{DOCKER_REGISTRY\}/\\$\{IMAGE_NAME\}:\\$\{IMAGE_TAG\}")
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry("https://\\$\{DOCKER_REGISTRY\}", 'docker-registry-credentials') {
                        docker.image("\\$\{DOCKER_REGISTRY\}/\\$\{IMAGE_NAME\}:\\$\{IMAGE_TAG\}").push()
                        docker.image("\\$\{DOCKER_REGISTRY\}/\\$\{IMAGE_NAME\}:\\$\{IMAGE_TAG\}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh """
                    kubectl set image deployment/myapp myapp=\\$\{DOCKER_REGISTRY\}/\\$\{IMAGE_NAME\}:\\$\{IMAGE_TAG\}
                    kubectl rollout status deployment/myapp
                """
            }
        }
    }
}`
      },
      {
        name: 'Kubernetes Deployment Pipeline',
        code: `pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod'], description: 'Deployment environment')
        string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Docker image tag')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/k8s-manifests.git'
            }
        }
        
        stage('Validate Manifests') {
            steps {
                sh 'kubectl --dry-run=client apply -f k8s/'
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                        sed -i 's|IMAGE_TAG|\\$\{params.IMAGE_TAG\}|g' k8s/deployment.yaml
                        kubectl apply -f k8s/ -n \\$\{params.ENVIRONMENT\}
                        kubectl rollout status deployment/myapp -n \\$\{params.ENVIRONMENT\}
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sh """
                        sleep 30
                        kubectl get pods -n \\$\{params.ENVIRONMENT\}
                        kubectl get svc -n \\$\{params.ENVIRONMENT\}
                    """
                }
            }
        }
    }
    
    post {
        success {
            slackSend(channel: '#deployments', 
                     color: 'good', 
                     message: "✅ Deployment to \\$\{params.ENVIRONMENT\} succeeded!")
        }
        failure {
            slackSend(channel: '#deployments', 
                     color: 'danger', 
                     message: "❌ Deployment to \\$\{params.ENVIRONMENT\} failed!")
        }
    }
}`
      }
    ],
    terraform: [
      {
        name: 'Basic EC2 Instance',
        code: `# main.tf
terraform {
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
  key_name      = var.key_name
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  tags = {
    Name = "WebServer"
    Environment = var.environment
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

resource "aws_security_group" "web" {
  name_prefix = "web-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# variables.tf
variable "aws_region" {
  description = "AWS region"
  default     = "us-west-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "key_name" {
  description = "AWS key pair name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  default     = "dev"
}

# outputs.tf
output "instance_ip" {
  value = aws_instance.web.public_ip
}

output "instance_dns" {
  value = aws_instance.web.public_dns
}`
      },
      {
        name: 'VPC with Subnets',
        code: `# vpc.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "\${var.project_name}-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "\${var.project_name}-igw"
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "\${var.project_name}-public-\${count.index + 1}"
    Type = "Public"
  }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)
  
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "\${var.project_name}-private-\${count.index + 1}"
    Type = "Private"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name = "\${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)
  
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

data "aws_availability_zones" "available" {
  state = "available"
}

# variables.tf
variable "project_name" {
  description = "Name of the project"
  default     = "myproject"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}`
      },
      {
        name: 'EKS Cluster',
        code: `# eks.tf
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster.arn
  version  = var.kubernetes_version
  
  vpc_config {
    subnet_ids              = concat(aws_subnet.public[*].id, aws_subnet.private[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = var.public_access_cidrs
  }
  
  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
  ]
  
  tags = {
    Name = var.cluster_name
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "\${var.cluster_name}-nodes"
  node_role_arn   = aws_iam_role.eks_node_group.arn
  subnet_ids      = aws_subnet.private[*].id
  
  instance_types = var.node_instance_types
  ami_type       = "AL2_x86_64"
  capacity_type  = "ON_DEMAND"
  
  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.max_capacity
    min_size     = var.min_capacity
  }
  
  update_config {
    max_unavailable = 1
  }
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_policy,
  ]
  
  tags = {
    Name = "\${var.cluster_name}-nodes"
  }
}

# IAM roles
resource "aws_iam_role" "eks_cluster" {
  name = "\${var.cluster_name}-cluster-role"
  
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster.name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster.name
}

# variables.tf
variable "cluster_name" {
  description = "Name of the EKS cluster"
  default     = "my-eks-cluster"
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  default     = "1.27"
}

variable "node_instance_types" {
  description = "Instance types for EKS nodes"
  default     = ["t3.medium"]
}

variable "desired_capacity" {
  description = "Desired number of nodes"
  default     = 2
}

variable "max_capacity" {
  description = "Maximum number of nodes"
  default     = 4
}

variable "min_capacity" {
  description = "Minimum number of nodes"
  default     = 1
}

variable "public_access_cidrs" {
  description = "CIDR blocks for public access"
  default     = ["0.0.0.0/0"]
}`
      }
    ],
    ansible: [
      {
        name: 'Basic Server Setup',
        code: `# inventory.yml
all:
  hosts:
    web1:
      ansible_host: 192.168.1.10
    web2:
      ansible_host: 192.168.1.11
    db1:
      ansible_host: 192.168.1.20
  children:
    webservers:
      hosts:
        web1:
        web2:
    databases:
      hosts:
        db1:
  vars:
    ansible_user: ubuntu
    ansible_ssh_private_key_file: ~/.ssh/id_rsa

# playbook.yml
---
- name: Basic Server Setup
  hosts: all
  become: yes
  vars:
    packages:
      - curl
      - wget
      - git
      - htop
      - vim
      - unzip
    
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes
        cache_valid_time: 3600
      when: ansible_os_family == "Debian"
    
    - name: Install basic packages
      package:
        name: "{{ packages }}"
        state: present
    
    - name: Create admin user
      user:
        name: admin
        groups: sudo
        shell: /bin/bash
        create_home: yes
    
    - name: Set up SSH key for admin user
      authorized_key:
        user: admin
        key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
    
    - name: Configure firewall
      ufw:
        rule: allow
        port: "{{ item }}"
      loop:
        - 22
        - 80
        - 443
    
    - name: Enable firewall
      ufw:
        state: enabled
    
    - name: Set timezone
      timezone:
        name: UTC`
      },
      {
        name: 'Docker Installation',
        code: `# docker-install.yml
---
- name: Install Docker on Ubuntu servers
  hosts: all
  become: yes
  vars:
    docker_users:
      - ubuntu
      - admin
    
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes
        cache_valid_time: 3600
    
    - name: Install required packages
      apt:
        name:
          - apt-transport-https
          - ca-certificates
          - curl
          - gnupg
          - lsb-release
        state: present
    
    - name: Add Docker GPG key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present
    
    - name: Add Docker repository
      apt_repository:
        repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
        state: present
    
    - name: Install Docker
      apt:
        name:
          - docker-ce
          - docker-ce-cli
          - containerd.io
          - docker-compose-plugin
        state: present
        update_cache: yes
    
    - name: Start and enable Docker service
      systemd:
        name: docker
        state: started
        enabled: yes
    
    - name: Add users to docker group
      user:
        name: "{{ item }}"
        groups: docker
        append: yes
      loop: "{{ docker_users }}"
    
    - name: Install Docker Compose
      get_url:
        url: "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64"
        dest: /usr/local/bin/docker-compose
        mode: '0755'
    
    - name: Verify Docker installation
      command: docker --version
      register: docker_version
    
    - name: Display Docker version
      debug:
        msg: "Docker installed: {{ docker_version.stdout }}"
    
    - name: Test Docker with hello-world
      docker_container:
        name: hello-world-test
        image: hello-world
        state: started
        auto_remove: yes`
      },
      {
        name: 'LAMP Stack Setup',
        code: `# lamp-stack.yml
---
- name: Install LAMP Stack
  hosts: webservers
  become: yes
  vars:
    mysql_root_password: "SecurePassword123!"
    php_version: "8.1"
    
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes
        cache_valid_time: 3600
    
    # Apache Installation
    - name: Install Apache
      apt:
        name: apache2
        state: present
    
    - name: Start and enable Apache
      systemd:
        name: apache2
        state: started
        enabled: yes
    
    - name: Enable Apache modules
      apache2_module:
        name: "{{ item }}"
        state: present
      loop:
        - rewrite
        - ssl
        - headers
      notify: restart apache
    
    # MySQL Installation
    - name: Install MySQL
      apt:
        name:
          - mysql-server
          - mysql-client
          - python3-pymysql
        state: present
    
    - name: Start and enable MySQL
      systemd:
        name: mysql
        state: started
        enabled: yes
    
    - name: Set MySQL root password
      mysql_user:
        name: root
        password: "{{ mysql_root_password }}"
        login_unix_socket: /var/run/mysqld/mysqld.sock
        state: present
    
    - name: Create MySQL configuration file
      template:
        src: my.cnf.j2
        dest: /root/.my.cnf
        owner: root
        group: root
        mode: '0600'
    
    # PHP Installation
    - name: Add PHP repository
      apt_repository:
        repo: "ppa:ondrej/php"
        state: present
    
    - name: Install PHP and modules
      apt:
        name:
          - "php{{ php_version }}"
          - "php{{ php_version }}-mysql"
          - "php{{ php_version }}-curl"
          - "php{{ php_version }}-gd"
          - "php{{ php_version }}-mbstring"
          - "php{{ php_version }}-xml"
          - "php{{ php_version }}-zip"
          - libapache2-mod-php
        state: present
        update_cache: yes
    
    - name: Create PHP info page
      copy:
        content: |
          <?php
          phpinfo();
          ?>
        dest: /var/www/html/info.php
        owner: www-data
        group: www-data
        mode: '0644'
    
    - name: Create sample database
      mysql_db:
        name: sampledb
        state: present
        login_user: root
        login_password: "{{ mysql_root_password }}"
    
    - name: Create database user
      mysql_user:
        name: webuser
        password: "WebPassword123!"
        priv: "sampledb.*:ALL"
        state: present
        login_user: root
        login_password: "{{ mysql_root_password }}"
    
    - name: Configure firewall for web traffic
      ufw:
        rule: allow
        port: "{{ item }}"
      loop:
        - 80
        - 443
    
  handlers:
    - name: restart apache
      systemd:
        name: apache2
        state: restarted

# templates/my.cnf.j2
[client]
user=root
password={{ mysql_root_password }}`
      }
    ],
    helm: [
      {
        name: 'Basic Web App Chart',
        code: `# Chart.yaml
apiVersion: v2
name: webapp
description: A Helm chart for a basic web application
type: application
version: 0.1.0
appVersion: "1.0.0"

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
  className: ""
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "webapp.fullname" . }}
  labels:
    {{- include "webapp.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
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
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /
              port: http
          readinessProbe:
            httpGet:
              path: /
              port: http
          resources:
            {{- toYaml .Values.resources | nindent 12 }}

# templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "webapp.fullname" . }}
  labels:
    {{- include "webapp.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "webapp.selectorLabels" . | nindent 4 }}`
      },
      {
        name: 'Microservice with Database',
        code: `# Chart.yaml
apiVersion: v2
name: microservice
description: A microservice with PostgreSQL database
type: application
version: 0.1.0
appVersion: "1.0.0"
dependencies:
  - name: postgresql
    version: 12.x.x
    repository: https://charts.bitnami.com/bitnami

# values.yaml
app:
  name: myapp
  replicaCount: 2
  image:
    repository: myapp
    tag: "latest"
    pullPolicy: IfNotPresent
  
  service:
    type: ClusterIP
    port: 8080
  
  env:
    - name: DATABASE_URL
      value: "postgresql://{{ .Values.postgresql.auth.username }}:{{ .Values.postgresql.auth.password }}@{{ include "microservice.fullname" . }}-postgresql:5432/{{ .Values.postgresql.auth.database }}"
    - name: REDIS_URL
      value: "redis://{{ include "microservice.fullname" . }}-redis:6379"

postgresql:
  enabled: true
  auth:
    username: appuser
    password: apppassword
    database: appdb
  primary:
    persistence:
      enabled: true
      size: 8Gi

redis:
  enabled: true
  auth:
    enabled: false
  master:
    persistence:
      enabled: true
      size: 8Gi

ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
  hosts:
    - host: myapp.local
      paths:
        - path: /
          pathType: Prefix

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "microservice.fullname" . }}
  labels:
    {{- include "microservice.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.app.replicaCount }}
  selector:
    matchLabels:
      {{- include "microservice.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "microservice.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.app.image.repository }}:{{ .Values.app.image.tag }}"
          imagePullPolicy: {{ .Values.app.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.app.service.port }}
              protocol: TCP
          env:
            {{- toYaml .Values.app.env | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5

# templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "microservice.fullname" . }}-config
data:
  app.properties: |
    server.port={{ .Values.app.service.port }}
    spring.datasource.url={{ .Values.app.env.DATABASE_URL }}
    spring.redis.url={{ .Values.app.env.REDIS_URL }}
    logging.level.com.myapp=DEBUG`
      },
      {
        name: 'App with Monitoring',
        code: `# Chart.yaml
apiVersion: v2
name: monitored-app
description: Application with Prometheus monitoring
type: application
version: 0.1.0
appVersion: "1.0.0"
dependencies:
  - name: prometheus
    version: 15.x.x
    repository: https://prometheus-community.github.io/helm-charts
    condition: prometheus.enabled
  - name: grafana
    version: 6.x.x
    repository: https://grafana.github.io/helm-charts
    condition: grafana.enabled

# values.yaml
app:
  name: monitored-app
  replicaCount: 3
  image:
    repository: myapp
    tag: "latest"
    pullPolicy: IfNotPresent
  
  service:
    type: ClusterIP
    port: 8080
  
  metrics:
    enabled: true
    port: 9090
    path: /metrics

prometheus:
  enabled: true
  server:
    persistentVolume:
      enabled: true
      size: 10Gi
  
  serverFiles:
    prometheus.yml:
      scrape_configs:
        - job_name: 'monitored-app'
          static_configs:
            - targets: ['monitored-app:9090']
          metrics_path: /metrics
          scrape_interval: 15s

grafana:
  enabled: true
  adminPassword: admin123
  persistence:
    enabled: true
    size: 10Gi
  
  datasources:
    datasources.yaml:
      apiVersion: 1
      datasources:
        - name: Prometheus
          type: prometheus
          url: http://monitored-app-prometheus-server
          access: proxy
          isDefault: true

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "monitored-app.fullname" . }}
  labels:
    {{- include "monitored-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.app.replicaCount }}
  selector:
    matchLabels:
      {{- include "monitored-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "monitored-app.selectorLabels" . | nindent 8 }}
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "{{ .Values.app.metrics.port }}"
        prometheus.io/path: "{{ .Values.app.metrics.path }}"
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.app.image.repository }}:{{ .Values.app.image.tag }}"
          imagePullPolicy: {{ .Values.app.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.app.service.port }}
              protocol: TCP
            {{- if .Values.app.metrics.enabled }}
            - name: metrics
              containerPort: {{ .Values.app.metrics.port }}
              protocol: TCP
            {{- end }}
          livenessProbe:
            httpGet:
              path: /health
              port: http
          readinessProbe:
            httpGet:
              path: /ready
              port: http

# templates/servicemonitor.yaml
{{- if .Values.app.metrics.enabled }}
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {{ include "monitored-app.fullname" . }}
  labels:
    {{- include "monitored-app.labels" . | nindent 4 }}
spec:
  selector:
    matchLabels:
      {{- include "monitored-app.selectorLabels" . | nindent 6 }}
  endpoints:
    - port: metrics
      path: {{ .Values.app.metrics.path }}
      interval: 15s
{{- end }}`
      }
    ]
  };

  const loadExample = (example: any) => {
    setCode(example.code);
    setSelectedExample(example.name);
  };

  const runCode = () => {
    if (!code.trim()) {
      setOutput('⚠️  No code to execute. Please enter some configuration or select an example.');
      return;
    }

    // Simulate different outputs based on tool type and code content
    let simulatedOutput = '';
    
    if (tool.id === 'docker') {
      if (code.includes('FROM')) {
        simulatedOutput = `🐳 Docker Build Simulation:

Step 1/6 : FROM ${code.match(/FROM\s+(\S+)/)?.[1] || 'base-image'}
 ---> Using cached image
Step 2/6 : WORKDIR /app
 ---> Using cached
Step 3/6 : COPY package*.json ./
 ---> Using cached
Step 4/6 : RUN npm install
 ---> Running in abc123def456
Successfully built image

✅ Build completed successfully!`;
      } else {
        simulatedOutput = `🐳 Docker Command Simulation:

Executing Docker commands...
✅ Commands executed successfully!`;
      }
    } else if (tool.id === 'kubernetes') {
      simulatedOutput = `☸️  Kubernetes Deployment Simulation:

deployment.apps/webapp created
service/webapp-service created

Waiting for deployment to be ready...
deployment "webapp" successfully rolled out

✅ Resources deployed successfully!`;
    } else if (tool.id === 'jenkins') {
      simulatedOutput = `🔧 Jenkins Pipeline Simulation:

Started by user admin
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] stage (Checkout)
[Pipeline] git
✅ Checkout completed
[Pipeline] stage (Build)
[Pipeline] sh
+ npm install
✅ Build completed
[Pipeline] stage (Test)
[Pipeline] sh
+ npm test
✅ Tests passed
[Pipeline] End of Pipeline

✅ Pipeline completed successfully!`;
    } else if (tool.id === 'terraform') {
      simulatedOutput = `🏗️  Terraform Plan Simulation:

Initializing the backend...
Initializing provider plugins...

Terraform used the selected providers to generate the following execution plan:

  # aws_instance.web will be created
  + resource "aws_instance" "web" {
      + ami           = "ami-12345678"
      + instance_type = "t3.micro"
    }

Plan: 1 to add, 0 to change, 0 to destroy.

✅ Plan generated successfully!`;
    } else if (tool.id === 'ansible') {
      simulatedOutput = `⚙️  Ansible Playbook Simulation:

PLAY [Basic Server Setup] ******************************************************

TASK [Update package cache] ****************************************************
ok: [web1]
ok: [web2]

TASK [Install basic packages] **************************************************
changed: [web1]
changed: [web2]

PLAY RECAP *********************************************************************
web1                       : ok=2    changed=1    unreachable=0    failed=0
web2                       : ok=2    changed=1    unreachable=0    failed=0

✅ Playbook executed successfully!`;
    } else if (tool.id === 'helm') {
      simulatedOutput = `⎈ Helm Deployment Simulation:

NAME: webapp
LAST DEPLOYED: ${new Date().toLocaleString()}
NAMESPACE: default
STATUS: deployed
REVISION: 1

RESOURCES:
==> v1/Deployment
NAME     READY  UP-TO-DATE  AVAILABLE  AGE
webapp   3/3    3           3          1m

==> v1/Service
NAME            TYPE       CLUSTER-IP     EXTERNAL-IP  PORT(S)   AGE
webapp-service  ClusterIP  10.96.123.45   <none>       80/TCP    1m

✅ Chart deployed successfully!`;
    } else {
      simulatedOutput = `🚀 Configuration Simulation:

Processing configuration...
Validating syntax...
Applying changes...

✅ Configuration applied successfully!`;
    }

    // Add error simulation for common mistakes
    if (code.includes('error') || code.includes('wrong') || code.includes('mistake')) {
      simulatedOutput = `❌ Execution Failed:

Error: Configuration contains issues
Please check your syntax and try again.

Common issues:
- Check indentation
- Verify required fields
- Ensure proper syntax`;
    }

    setOutput(`🔄 Simulated Execution Results:

${simulatedOutput}

📝 Note: This is a simulation for learning purposes. 
In a real environment, this would execute actual ${tool.name} commands.`);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const currentExamples = examples[tool.id as keyof typeof examples] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center space-x-3">
                <tool.icon className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{tool.name} Playground</h1>
                  <p className="text-sm text-gray-600">Interactive environment for {tool.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyCode}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={runCode}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Run</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Examples Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Load Examples
              </h3>
              <div className="space-y-2">
                {currentExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => loadExample(example)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedExample === example.name
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{example.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Code Editor
                </h3>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg border-0 resize-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter your ${tool.name} configuration here...`}
                />
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Terminal className="w-5 h-5 mr-2" />
                  Output
                </h3>
              </div>
              <div className="p-4">
                <div className="h-96 bg-black text-green-400 font-mono text-sm p-4 rounded-lg overflow-auto">
                  {output || 'Output will appear here when you run the code...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;