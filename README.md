# React + Node.js Kubernetes Deployment

A full-stack application with React frontend and Node.js Express backend, deployed using Helm charts on Kubernetes.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
- - [Local Development with Kubernetes](#local-development-with-kubernetes-without-docker-hub)
  - - [GitHub Codespaces Deployment](#github-codespaces-deployment)
- [Kubernetes Deployment with Helm](#kubernetes-deployment-with-helm)
- [Configuration](#configuration)
- [Usage](#usage)

## 📁 Project Structure

```
React-kub-test-frontend-backend/
├── Backend/
│   ├── server.js          # Express server
│   ├── .env              # Backend environment variables
│   └── package.json
├── Frontend/
│   ├── src/
│   │   └── App.jsx       # React login component
│   ├── .env              # Frontend environment variables
│   └── package.json
└── helm-chart/
    ├── Chart.yaml        # Helm chart metadata
    ├── values.yaml       # Configuration values
    ├── .helmignore       # Helm ignore patterns
    └── templates/
        ├── _helpers.tpl              # Helper templates
        ├── backend-deployment.yaml   # Backend Deployment
        ├── backend-service.yaml      # Backend Service
        ├── frontend-deployment.yaml  # Frontend Deployment
        └── frontend-service.yaml     # Frontend Service
```

## ✅ Prerequisites

- **Node.js** (v14 or higher)
- **Docker** (for containerization)
- **Kubernetes** cluster (minikube, kind, or cloud provider)
- **Helm** (v3 or higher)
- **kubectl** (configured to access your cluster)

## 🔧 Environment Setup

### Backend (.env)

Create `Backend/.env`:

```env
PORT=5000
HOST=0.0.0.0
```

### Frontend (.env)

Create `Frontend/.env`:

```env
# For local development
VITE_API_BASE=http://localhost:5000

# For Docker/Kubernetes
# VITE_API_BASE=http://backend-service:5000
```

## 🚀 Local Development

### Backend

```bash
cd Backend
npm install
node server.js
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` (or port shown in terminal)

### Test Login

- **Email:** `admin@example.com`
- **Password:** `admin123`

## 🐳 Docker Setup

### Build Docker Images

```bash
# Build backend
cd Backend
docker build -t your-dockerhub-username/backend:latest .

# Build frontend
cd Frontend
docker build -t your-dockerhub-username/frontend:latest .
```

### Push to Docker Hub

```bash
docker push your-dockerhub-username/backend:latest
docker push your-dockerhub-username/frontend:latest
```

## 📦 Local Development with Kubernetes (Without Docker Hub)

### Option 1: Using Minikube's Docker Daemon (Recommended)

When using Minikube, you can build images directly into Minikube's Docker daemon, avoiding the need to push to Docker Hub.

```bash
# Point your terminal to use Minikube's Docker daemon
eval $(minikube docker-env)

# Now build your images - they'll be available in Minikube
cd Backend
docker build -t backend:latest .

cd ../Frontend  
docker build -t frontend:latest .

# Verify images are in Minikube
docker images
```

**Update your `helm-chart/values.yaml`:**

```yaml
backend:
  image:
    repository: backend  # No username needed
    tag: latest
    pullPolicy: Never    # Important! Never pull from registry

frontend:
  image:
    repository: frontend  # No username needed
    tag: latest
    pullPolicy: Never     # Important! Never pull from registry
```

### Option 2: Load Images into Kind

If using Kind (Kubernetes in Docker):

```bash
# Build images normally
cd Backend
docker build -t backend:latest .

cd ../Frontend
docker build -t frontend:latest .

# Load images into Kind cluster
kind load docker-image backend:latest
kind load docker-image frontend:latest
```

### Option 3: Using Local Docker Registry

Set up a local registry for better image management:

```bash
# Start local registry
docker run -d -p 5000:5000 --name registry registry:2

# Tag and push images to local registry
docker tag backend:latest localhost:5000/backend:latest
docker tag frontend:latest localhost:5000/frontend:latest

docker push localhost:5000/backend:latest
docker push localhost:5000/frontend:latest
```

**Update `values.yaml`:**

```yaml
backend:
  image:
    repository: localhost:5000/backend
    tag: latest
    pullPolicy: IfNotPresent

frontend:
  image:
    repository: localhost:5000/frontend
    tag: latest
    pullPolicy: IfNotPresent
```

### Using NodePort Service Type

For local development, NodePort is more practical than LoadBalancer.

**Update `helm-chart/values.yaml` to use NodePort:**

```yaml
backend:
  service:
    name: backend-service
    type: ClusterIP        # Keep backend as ClusterIP
    port: 5000
    targetPort: 5000

frontend:
  service:
    name: frontend-service
    type: NodePort         # Change to NodePort for local access
    port: 80
    targetPort: 3000
    nodePort: 30080        # Optional: specify port (30000-32767)
```

**Access your application:**

```bash
# For Minikube
minikube service frontend-service --url
# Or
minikube service frontend-service  # Opens in browser automatically

# For Kind - Use kubectl port-forward
kubectl port-forward service/frontend-service 8080:80
# Then access at http://localhost:8080

# Get NodePort value
kubectl get service frontend-service
```

### Complete Local Development Workflow

```bash
# 1. Point to Minikube's Docker (if using Minikube)
eval $(minikube docker-env)

# 2. Build images
cd Backend && docker build -t backend:latest . && cd ..
cd Frontend && docker build -t frontend:latest . && cd ..

# 3. Update values.yaml (set pullPolicy: Never and remove dockerhub username)

# 4. Install/Upgrade Helm chart
helm upgrade --install my-app ./helm-chart

# 5. Access application
minikube service frontend-service

# 6. Check logs if needed
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
```

### Environment Variable Configuration for Local Setup

**Frontend `.env` for Kubernetes:**

```env
# The backend service name in Kubernetes
VITE_API_BASE=http://backend-service:5000
```

**Important Notes:**

1. **ImagePullPolicy:** Set to `Never` when using Minikube's daemon
2. **Service Communication:** Frontend communicates with backend using service name `backend-service:5000`
3. **Rebuild:** After code changes, rebuild images and upgrade Helm chart
4. **Reset Docker Env:** Run `eval $(minikube docker-env -u)` to return to host Docker


## 💻 GitHub Codespaces Deployment

GitHub Codespaces provides a complete development environment in the cloud, making it perfect for developing and testing Kubernetes applications without local setup.

### What You Get with Codespaces:

- **Pre-configured Environment:** Node.js, Docker, kubectl, and Helm pre-installed
- **Integrated Terminal:** Full access to Linux terminal
- **Port Forwarding:** Automatic port forwarding for web services
- **VS Code in Browser:** Full IDE experience
- **Free Tier:** 60 hours/month for free (for individual accounts)

### Step 1: Create a Codespace

1. Go to your repository on GitHub
2. Click the **Code** button (green button)
3. Select the **Codespaces** tab
4. Click **Create codespace on main**

Your codespace will start with all dependencies ready!

### Step 2: Create Dev Container Configuration (Optional)

For a customized experience, create `.devcontainer/devcontainer.json`:

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
  "forwardPorts": [3000, 5000, 5173, 30080],
  "portsAttributes": {
    "3000": {
      "label": "Frontend",
      "onAutoForward": "notify"
    },
    "5000": {
      "label": "Backend",
      "onAutoForward": "notify"
    }
  },
  "postCreateCommand": "cd Backend && npm install && cd ../Frontend && npm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-azuretools.vscode-docker",
        "ms-kubernetes-tools.vscode-kubernetes-tools",
        "esbenp.prettier-vscode"
      ]
    }
  }
}
```

### Step 3: Local Development in Codespaces

**Option A: Run Without Kubernetes (Quickest)**

```bash
# Terminal 1 - Backend
cd Backend
npm install
node server.js

# Terminal 2 - Frontend  
cd Frontend
npm install
npm run dev
```

Codespaces will automatically forward ports. Click the **Ports** tab to see forwarded URLs.

**Option B: Use Minikube in Codespaces**

```bash
# Start Minikube with Docker driver
minikube start --driver=docker --container-runtime=docker

# Verify Minikube is running
minikube status

# Point Docker to Minikube's daemon
eval $(minikube docker-env)

# Build images
cd Backend
docker build -t backend:latest .

cd ../Frontend
docker build -t frontend:latest .

# Create values-codespaces.yaml
cat > ../helm-chart/values-codespaces.yaml <<EOF
backend:
  image:
    repository: backend
    tag: latest
    pullPolicy: Never
  service:
    type: ClusterIP
    port: 5000
    targetPort: 5000

frontend:
  image:
    repository: frontend
    tag: latest
    pullPolicy: Never
  service:
    type: NodePort
    port: 80
    targetPort: 5173
    nodePort: 30080
EOF

# Deploy with Helm
helm upgrade --install my-app ../helm-chart -f ../helm-chart/values-codespaces.yaml

# Port forward to access
kubectl port-forward service/frontend-service 3000:80 --address='0.0.0.0'
```

### Step 4: Access Your Application

**For Local Development (No K8s):**
- GitHub will show a popup for forwarded ports
- Click on the port to open in browser
- Or go to **Ports** tab and click the globe icon

**For Minikube Deployment:**
```bash
# Get Minikube service URL
minikube service frontend-service --url

# Or use port forwarding (recommended for Codespaces)
kubectl port-forward service/frontend-service 8080:80 --address='0.0.0.0'
```

Then access via the forwarded port in the Ports tab.

### Step 5: Development Workflow

```bash
# Make code changes

# Rebuild images
eval $(minikube docker-env)
cd Backend && docker build -t backend:latest .
cd Frontend && docker build -t frontend:latest .

# Restart pods
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend

# Check status
kubectl get pods
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
```

### Advantages of Codespaces:

✅ **No Local Setup:** Everything runs in the cloud  
✅ **Consistent Environment:** Same setup for all developers  
✅ **Resource Efficient:** Uses GitHub's infrastructure  
✅ **Quick Start:** Ready in ~2 minutes  
✅ **Shareable:** Share your codespace URL with team  
✅ **Free Tier:** 60 hours/month free for individuals  

### Troubleshooting in Codespaces:

**Port Not Accessible:**
```bash
# Make sure to use --address='0.0.0.0' for port forwarding
kubectl port-forward service/frontend-service 8080:80 --address='0.0.0.0'
```

**Minikube Won't Start:**
```bash
# Clean up and restart
minikube delete
minikube start --driver=docker
```

**Docker Out of Space:**
```bash
# Clean up Docker
docker system prune -a
```

### Cost Management:

- **Free Tier:** 60 hours/month (2-core, 4GB RAM)
- **Stop Codespace:** Stops after 30 minutes of inactivity
- **Manual Stop:** Click "Stop Codespace" when done
- **Delete Codespace:** Delete when no longer needed

### Complete Codespaces Setup Script:

Create a file `setup-codespace.sh`:

```bash
#!/bin/bash
echo "Setting up Codespace for React-Kubernetes App..."

# Install dependencies
cd Backend && npm install && cd ..
cd Frontend && npm install && cd ..

# Start Minikube
minikube start --driver=docker

# Build images
eval $(minikube docker-env)
docker build -t backend:latest ./Backend
docker build -t frontend:latest ./Frontend

# Deploy
helm upgrade --install my-app ./helm-chart \
  --set backend.image.repository=backend \
  --set backend.image.pullPolicy=Never \
  --set frontend.image.repository=frontend \
  --set frontend.image.pullPolicy=Never \
  --set frontend.service.type=NodePort

echo "Setup complete! Use 'kubectl get pods' to check status."
echo "Forward ports with: kubectl port-forward service/frontend-service 8080:80 --address='0.0.0.0'"
```

Make it executable and run:
```bash
chmod +x setup-codespace.sh
./setup-codespace.sh
```




## ☸️ Kubernetes Deployment with Helm

### Step 1: Update Helm Values

Edit `helm-chart/values.yaml` and update the Docker image repositories:

```yaml
backend:
  image:
    repository: your-dockerhub-username/backend  # Update this
    tag: latest

frontend:
  image:
    repository: your-dockerhub-username/frontend  # Update this
    tag: latest
```

### Step 2: Install the Helm Chart

```bash
# Install the chart
helm install my-app ./helm-chart

# Check deployment status
kubectl get pods
kubectl get services
```

### Step 3: Access the Application

```bash
# Get the frontend service external IP (for LoadBalancer)
kubectl get service frontend-service

# For minikube
minikube service frontend-service

# Port forward (alternative method)
kubectl port-forward service/frontend-service 8080:80
```

Access the application at `http://localhost:8080` (if using port-forward)

### Helm Commands

```bash
# List installed releases
helm list

# Upgrade the deployment
helm upgrade my-app ./helm-chart

# Rollback to previous version
helm rollback my-app

# Uninstall the deployment
helm uninstall my-app

# View values
helm get values my-app
```

## ⚙️ Configuration

### Helm Chart Values

Key configurations in `helm-chart/values.yaml`:

| Parameter | Description | Default |
|-----------|-------------|----------|
| `backend.replicaCount` | Number of backend replicas | `1` |
| `backend.image.repository` | Backend Docker image | `your-dockerhub-username/backend` |
| `backend.service.port` | Backend service port | `5000` |
| `frontend.replicaCount` | Number of frontend replicas | `1` |
| `frontend.image.repository` | Frontend Docker image | `your-dockerhub-username/frontend` |
| `frontend.service.type` | Frontend service type | `LoadBalancer` |
| `frontend.service.port` | Frontend service port | `80` |

### Resource Limits

Default resource limits (can be modified in `values.yaml`):

```yaml
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
```

## 📖 Usage

### Development Workflow

1. Make changes to your code
2. Build new Docker images
3. Push to Docker Hub
4. Update Helm chart (if needed)
5. Upgrade deployment:
   ```bash
   helm upgrade my-app ./helm-chart
   ```

### Scaling

```bash
# Scale backend
kubectl scale deployment backend --replicas=3

# Scale frontend
kubectl scale deployment frontend --replicas=3

# Or update values.yaml and upgrade
helm upgrade my-app ./helm-chart
```

### Monitoring

```bash
# View logs
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend

# Describe pods
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

## 🔍 Troubleshooting

### Common Issues

1. **Pods not starting:**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Image pull errors:**
   - Verify Docker image names in `values.yaml`
   - Check Docker Hub credentials
   - Ensure images are pushed to registry

3. **Service not accessible:**
   ```bash
   kubectl get services
   kubectl describe service frontend-service
   ```

4. **Backend connection issues:**
   - Check `VITE_API_BASE` environment variable
   - Verify backend service name: `backend-service`
   - Check backend logs: `kubectl logs -f deployment/backend`

## 📝 API Endpoints

### Backend API

- **POST** `/api/login` - User login
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Satishpanga**

## 🙏 Acknowledgments

- React Team
- Express.js
- Kubernetes
- Helm
