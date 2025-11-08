# React + Node.js Kubernetes Deployment

A full-stack application with React frontend and Node.js Express backend, demonstrating multiple deployment methods using both Kubernetes manifests and Helm charts.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Methods](#deployment-methods)
  - [🏠 Method 1: Minikube Local Deployment](#-method-1-minikube-local-deployment)
  - [💻 Method 2: GitHub Codespaces Deployment](#-method-2-github-codespaces-deployment)
  - [🖥️ Method 3: Production Server with NodePort](#%EF%B8%8F-method-3-production-server-with-nodeport)
- [🔐 Secrets Management](#-secrets-management)
- [Troubleshooting](#troubleshooting)
- [API Endpoints](#api-endpoints)

## 📁 Project Structure

```
React-kub-test-frontend-backend/
├── Backend/
│   ├── server.js
│   ├── .env
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── Frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── .env
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── helm-chart/
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── .helmignore
│   └── templates/
│       ├── _helpers.tpl
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       └── frontend-service.yaml
└── kubernetes-manifests/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    └── frontend-service.yaml
```

## ✅ Prerequisites

- **Node.js** (v14 or higher)
- **Docker** & **Docker Desktop** (for image building)
- **kubectl** (configured for your cluster)
- **Helm** v3+ (for Helm deployments)
- **Minikube** or **Kind** (for local deployments)
- **kubeseal** CLI (for sealed secrets)

## 🔧 Environment Setup

### Backend Environment Variables

Create `Backend/.env`:

```bash
PORT=5000
HOST=0.0.0.0
```

### Frontend Environment Variables

Create `Frontend/.env`:

```bash
# For Kubernetes deployment (all environments)
VITE_API_BASE=http://backend-service:5000

# For local development only
# VITE_API_BASE=http://localhost:5000
```

**Note**: Frontend env variables must be set at build time for Vite/React.

---

## 🚀 Deployment Methods

# 🏠 Method 1: Minikube Local Deployment

## Overview

Deploy the application on your local machine using Minikube. You can use either raw Kubernetes manifests or Helm charts.

### Setup Minikube

```bash
# Start Minikube
minikube start --driver=docker

# Verify Minikube is running
minikube status

# Point Docker to Minikube's daemon (important!)
eval $(minikube docker-env)
```

### Build Docker Images

```bash
# Build backend
cd Backend
docker build -t backend:latest .

# Build frontend
cd ../Frontend
docker build -t frontend:latest .

# Verify images
docker images | grep -E 'backend|frontend'
```

## Method 1A: Using Kubernetes Manifests (kubectl)

### Update Image Names

Edit the deployment files to use local images:

```bash
# Edit kubernetes-manifests/backend-deployment.yaml
# Change: image: your-dockerhub-username/backend:latest
# To:     image: backend:latest
# And set: imagePullPolicy: Never

# Edit kubernetes-manifests/frontend-deployment.yaml
# Change: image: your-dockerhub-username/frontend:latest
# To:     image: frontend:latest
# And set: imagePullPolicy: Never
```

### Deploy with kubectl

```bash
# Apply all manifests
kubectl apply -f kubernetes-manifests/

# Check deployment status
kubectl get pods -n react-kub-app
kubectl get services -n react-kub-app

# View logs
kubectl logs -f deployment/backend -n react-kub-app
kubectl logs -f deployment/frontend -n react-kub-app
```

### Access the Application

```bash
# For Minikube - Open frontend service
minikube service frontend-service -n react-kub-app

# Or use port forwarding
kubectl port-forward service/frontend-service 8080:80 -n react-kub-app
# Access at: http://localhost:8080
```

## Method 1B: Using Helm Charts

### Update Helm Values

Create `helm-chart/values-minikube.yaml`:

```yaml
backend:
  image:
    repository: backend
    tag: latest
    pullPolicy: Never
  service:
    type: ClusterIP
    port: 5000
  replicaCount: 1

frontend:
  image:
    repository: frontend
    tag: latest
    pullPolicy: Never
  service:
    type: NodePort
    port: 80
    nodePort: 30080
  replicaCount: 1
```

### Deploy with Helm

```bash
# Install or upgrade the release
helm upgrade --install my-app ./helm-chart \
  -f helm-chart/values-minikube.yaml \
  -n react-kub-app \
  --create-namespace

# Check status
helm list -n react-kub-app
kubectl get pods -n react-kub-app
kubectl get services -n react-kub-app

# View deployed values
helm get values my-app -n react-kub-app
```

### Access the Application

```bash
# Get service URL
minikube service frontend-service -n react-kub-app --url

# Or access via NodePort
# http://<minikube-ip>:30080
minikube ip
```

### Useful Helm Commands

```bash
# Rollback to previous version
helm rollback my-app -n react-kub-app

# Uninstall
helm uninstall my-app -n react-kub-app

# Dry run (test without deploying)
helm install my-app ./helm-chart -f helm-chart/values-minikube.yaml --dry-run --debug
```

### Environment Variables for Minikube

**Backend/.env**:
```bash
PORT=5000
HOST=0.0.0.0
```

**Frontend/.env** (build time):
```bash
VITE_API_BASE=http://backend-service:5000
```

---

# 💻 Method 2: GitHub Codespaces Deployment

## Overview

GitHub Codespaces provides a cloud development environment with all tools pre-installed.

### Create a Codespace

1. Go to your repository on GitHub
2. Click the **Code** button (green)
3. Select the **Codespaces** tab
4. Click **Create codespace on main**

### Setup in Codespaces

```bash
# Start Minikube
minikube start --driver=docker

# Point to Minikube's Docker daemon
eval $(minikube docker-env)

# Build images
cd Backend && docker build -t backend:latest .
cd ../Frontend && docker build -t frontend:latest .
```

## Method 2A: Using Kubernetes Manifests (kubectl)

```bash
# Apply all manifests
kubectl apply -f kubernetes-manifests/

# Check status
kubectl get pods -n react-kub-app
kubectl get services -n react-kub-app

# Port forward (important for Codespaces!)
kubectl port-forward service/frontend-service 8080:80 -n react-kub-app --address='0.0.0.0'
```

**Access**: Codespaces will auto-forward port 8080. Click on the **Ports** tab and open the forwarded URL.

## Method 2B: Using Helm Charts

```bash
# Deploy with Helm
helm upgrade --install my-app ./helm-chart \
  -f helm-chart/values-minikube.yaml \
  -n react-kub-app \
  --create-namespace

# Port forward
kubectl port-forward service/frontend-service 8080:80 -n react-kub-app --address='0.0.0.0'
```

### Environment Variables for Codespaces

**Backend/.env**:
```bash
PORT=5000
HOST=0.0.0.0
```

**Frontend/.env** (build time):
```bash
VITE_API_BASE=http://backend-service:5000
```

### Dev Container Configuration (Optional)

Create `.devcontainer/devcontainer.json`:

```json
{
  "name": "React-Kubernetes-App",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/kubectl-helm-minikube:1": {
      "version": "latest",
      "helm": "latest",
      "minikube": "latest"
    }
  },
  "forwardPorts": [3000, 5000, 5173, 8080, 30080],
  "postCreateCommand": "cd Backend && npm install && cd ../Frontend && npm install"
}
```

---

# 🖥️ Method 3: Production Server with NodePort

## Overview

Deploy to a production Kubernetes cluster (cloud or on-premise) using NodePort for external access.

### Prerequisites

- Kubernetes cluster (EKS, GKE, AKS, or bare-metal)
- kubectl configured with cluster access
- Docker images pushed to registry (Docker Hub, ECR, GCR, etc.)

### Push Images to Registry

```bash
# Tag images
docker tag backend:latest your-dockerhub-username/backend:latest
docker tag frontend:latest your-dockerhub-username/frontend:latest

# Push to registry
docker push your-dockerhub-username/backend:latest
docker push your-dockerhub-username/frontend:latest
```

## Method 3A: Using Kubernetes Manifests (kubectl)

### Update Image Names

Edit deployment files:

```bash
# In backend-deployment.yaml
image: your-dockerhub-username/backend:latest
imagePullPolicy: IfNotPresent

# In frontend-deployment.yaml
image: your-dockerhub-username/frontend:latest
imagePullPolicy: IfNotPresent
```

### Update Service Type to NodePort

Edit `kubernetes-manifests/frontend-service.yaml`:

```yaml
spec:
  type: NodePort  # Changed from LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080  # Fixed port (30000-32767)
    name: http
```

### Deploy to Server

```bash
# Apply all manifests
kubectl apply -f kubernetes-manifests/

# Check status
kubectl get pods -n react-kub-app
kubectl get services -n react-kub-app
kubectl get nodes -o wide  # Get node IPs
```

### Access the Application

```bash
# Get node IP
kubectl get nodes -o wide

# Access application
# http://<NODE_IP>:30080

# Or if using cloud provider with external IPs
kubectl get service frontend-service -n react-kub-app
# Use EXTERNAL-IP:30080
```

## Method 3B: Using Helm Charts

### Create Production Values

Create `helm-chart/values-production.yaml`:

```yaml
backend:
  image:
    repository: your-dockerhub-username/backend
    tag: latest
    pullPolicy: IfNotPresent
  service:
    type: ClusterIP
    port: 5000
  replicaCount: 2  # Scale for production
  resources:
    requests:
      memory: "256Mi"
      cpu: "200m"
    limits:
      memory: "512Mi"
      cpu: "500m"

frontend:
  image:
    repository: your-dockerhub-username/frontend
    tag: latest
    pullPolicy: IfNotPresent
  service:
    type: NodePort
    port: 80
    nodePort: 30080
  replicaCount: 2  # Scale for production
  resources:
    requests:
      memory: "256Mi"
      cpu: "200m"
    limits:
      memory: "512Mi"
      cpu: "500m"
```

### Deploy with Helm

```bash
# Install or upgrade
helm upgrade --install my-app ./helm-chart \
  -f helm-chart/values-production.yaml \
  -n react-kub-app \
  --create-namespace

# Verify deployment
helm list -n react-kub-app
kubectl get all -n react-kub-app

# View release history
helm history my-app -n react-kub-app
```

### Environment Variables for Production

**Backend/.env** (or use ConfigMap/Secrets):
```bash
PORT=5000
HOST=0.0.0.0
```

**Frontend/.env** (build time):
```bash
VITE_API_BASE=http://backend-service:5000
```

### Scaling in Production

```bash
# Scale with kubectl
kubectl scale deployment backend --replicas=3 -n react-kub-app
kubectl scale deployment frontend --replicas=3 -n react-kub-app

# Or update Helm values and upgrade
helm upgrade my-app ./helm-chart -f helm-chart/values-production.yaml -n react-kub-app
```

---

# 🔐 Secrets Management

## Using Bitnami Sealed Secrets

Sealed Secrets allow you to encrypt secrets locally and store them safely in Git. They can only be decrypted by the controller running in your cluster.

### Install Sealed Secrets Controller (On Server)

```bash
# Install the controller on your Kubernetes cluster
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Verify installation
kubectl get pods -n kube-system | grep sealed-secrets
```

### Install kubeseal CLI (Locally)

```bash
# Linux
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/kubeseal-0.24.0-linux-amd64.tar.gz
tar -xvzf kubeseal-0.24.0-linux-amd64.tar.gz
sudo install -m 755 kubeseal /usr/local/bin/kubeseal

# macOS
brew install kubeseal

# Windows
choco install kubeseal

# Verify
kubeseal --version
```

### Create Secrets Locally

```bash
# Create a regular Kubernetes secret (locally, don't apply yet!)
kubectl create secret generic app-secrets \
  --from-literal=db-password=mySecurePassword123 \
  --from-literal=api-key=myApiKey456 \
  --from-literal=jwt-secret=myJwtSecret789 \
  --namespace=react-kub-app \
  --dry-run=client -o yaml > secret.yaml
```

### Fetch Server's Public Key (Optional)

```bash
# Fetch the public key from your cluster
kubeseal --fetch-cert --controller-name=sealed-secrets-controller --controller-namespace=kube-system > pub-cert.pem
```

### Seal the Secret (YES - Create Locally, Use on Server!)

```bash
# Seal the secret using the server's public key
kubeseal --format=yaml --cert=pub-cert.pem < secret.yaml > sealed-secret.yaml

# Or seal without fetching cert (uses cluster's cert automatically)
kubeseal --format=yaml < secret.yaml > sealed-secret.yaml
```

### Deploy Sealed Secret to Server

```bash
# Apply the sealed secret to your cluster
kubectl apply -f sealed-secret.yaml -n react-kub-app

# Verify - the sealed-secrets controller will decrypt it
kubectl get secrets -n react-kub-app
kubectl get sealedsecrets -n react-kub-app
```

### Using Secrets in Deployments

Update your deployment to use the secret:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  template:
    spec:
      containers:
      - name: backend
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-password
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-key
```

### Key Points

✅ **YES**: You can create sealed secrets locally  
✅ **YES**: You can store sealed secrets in Git safely  
✅ **YES**: Only the server can decrypt them  
✅ **YES**: The sealed-secrets controller decrypts automatically  
❌ **NO**: Regular secrets should never be in Git  

### Workflow Summary

1. Create secret locally (`kubectl create secret ... --dry-run`)
2. Seal it with kubeseal (`kubeseal < secret.yaml > sealed-secret.yaml`)
3. Commit `sealed-secret.yaml` to Git (safe!)
4. Apply to cluster (`kubectl apply -f sealed-secret.yaml`)
5. Controller decrypts and creates actual secret
6. Pods use the decrypted secret

---

## 🔍 Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n react-kub-app

# Describe pod for events
kubectl describe pod <pod-name> -n react-kub-app

# Check logs
kubectl logs <pod-name> -n react-kub-app
kubectl logs <pod-name> -n react-kub-app --previous  # For crashed pods
```

### Image Pull Errors

```bash
# For local images (Minikube/Codespaces)
# Ensure: imagePullPolicy: Never
# And: eval $(minikube docker-env)

# For registry images
# Check image name is correct
# Verify image exists: docker pull your-dockerhub-username/backend:latest
```

### Service Not Accessible

```bash
# Check services
kubectl get services -n react-kub-app

# Check endpoints
kubectl get endpoints -n react-kub-app

# Port forward to test
kubectl port-forward service/frontend-service 8080:80 -n react-kub-app
```

### Backend Connection Issues

```bash
# Verify backend service
kubectl get service backend-service -n react-kub-app

# Test from frontend pod
kubectl exec -it <frontend-pod> -n react-kub-app -- wget -O- http://backend-service:5000

# Check backend logs
kubectl logs deployment/backend -n react-kub-app --tail=100
```

### Helm Issues

```bash
# Check Helm release
helm list -n react-kub-app

# Get release details
helm get all my-app -n react-kub-app

# Rollback if needed
helm rollback my-app -n react-kub-app
```

---

## 📝 API Endpoints

### Backend API

**POST** `/api/login` - User login

Request:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": "admin@example.com"
}
```

### Test Credentials

- **Email**: `admin@example.com`
- **Password**: `admin123`

---

## 🔄 Comparison: kubectl vs Helm

| Feature | kubectl (Manifests) | Helm Charts |
|---------|-------------------|-------------|
| **Complexity** | Simple, direct | More setup initially |
| **Reusability** | Low | High - templating |
| **Configuration** | Edit YAML files | values.yaml files |
| **Versioning** | Manual | Built-in |
| **Rollback** | Manual | Easy (`helm rollback`) |
| **Best For** | Simple apps, learning | Production, complex apps |

---

## 🎯 Quick Reference

### Minikube Commands

```bash
minikube start
minikube stop
minikube delete
minikube ip
minikube service <service-name> -n <namespace>
eval $(minikube docker-env)          # Point to Minikube Docker
eval $(minikube docker-env -u)       # Reset to host Docker
```

### kubectl Commands

```bash
kubectl get pods -n react-kub-app
kubectl get services -n react-kub-app
kubectl get all -n react-kub-app
kubectl describe pod <pod-name> -n react-kub-app
kubectl logs -f <pod-name> -n react-kub-app
kubectl exec -it <pod-name> -n react-kub-app -- /bin/sh
kubectl delete -f kubernetes-manifests/
kubectl apply -f kubernetes-manifests/
```

### Helm Commands

```bash
helm install <release-name> <chart-path>
helm upgrade <release-name> <chart-path>
helm upgrade --install <release-name> <chart-path>
helm list -n <namespace>
helm uninstall <release-name> -n <namespace>
helm rollback <release-name> -n <namespace>
helm history <release-name> -n <namespace>
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License

This project is open source and available under the MIT License.

## 👤 Author

**Satishpanga**

## 🚀 Next Steps

- Add monitoring with Prometheus + Grafana
- Implement CI/CD with GitHub Actions
- Add Ingress for domain-based routing
- Configure horizontal pod autoscaling
- Set up persistent volumes for databases
- Implement logging with EFK stack

---

**Made with ❤️ for Kubernetes learners**
