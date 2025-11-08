# React + Node.js Kubernetes Deployment

A full-stack application with React frontend and Node.js Express backend, deployed using Helm charts on Kubernetes.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
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
