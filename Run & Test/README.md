# 🚖 GoCab Microservices – Kubernetes Local Setup

This workshop demonstrates running a microservices-based app using Docker and Kubernetes (locally). All services are exposed via `NodePort` and can be tested directly from your browser or Postman.


---

## 🔁 Workflow Summary

### 1. Build Docker Images  
### 2. Push to Docker Hub  
### 3. Create K8s Cluster (minikube or Docker Desktop)  
### 4. Apply ConfigMap & Secrets  
### 5. Deploy All Services  
### 6. Access & Test APIs  

---

## 🧱 Step 1: Build Docker Images

Build each service using `docker-compose` or manually.

If using `docker-compose` (with a defined `docker-compose.yaml`):
```bash
docker-compose build
```

Or, manually for each:

```bash
# Example: Frontend
docker build -t <username>/microservice-frontend ./frontend

# Similarly build other services...
```

---

## 🚀 Step 2: Push Images to Docker Hub

```bash
docker push <username>/microservice-frontend
docker push <username>/microservice-gateway
docker push <username>/microservice-user
docker push <username>/microservice-captain
docker push <username>/microservice-ride
docker push <username>/microservice-maps
docker push <username>/microservice-dynamic_price
docker push <username>/microservice-payment
```

---

## 🖥️ Step 3: Start Kubernetes Cluster

Using Docker Desktop (no extra steps)  
Or using Minikube:
```bash
minikube start
```

---

## ⚙️ Step 4: Apply ConfigMap & Secrets

```bash
kubectl apply -f configmap-secret.yaml
```

This creates all necessary environment variables and credentials for the services.

---

## 📦 Step 5: Deploy All Services

```bash
kubectl apply -f k8s-all.yaml
```

This will:
- Deploy all 8 microservices
- Expose them via `NodePort` to test locally

---

## 🌐 Step 6: Access Services

| Service         | Port      | Access URL                     |
|-----------------|-----------|--------------------------------|
| Frontend        | 30080     | http://localhost:30080         |
| Gateway         | 30000     | http://localhost:30000         |
| User Service    | 30001     | http://localhost:30001         |
| Captain Service | 30002     | http://localhost:30002         |
| Ride Service    | 30003     | http://localhost:30003         |
| Maps Service    | 30004     | http://localhost:30004         |
| Dynamic Price   | 30005     | http://localhost:30005         |
| Payment Service | 30006     | http://localhost:30006         |

---

## 🧪 Useful Commands

```bash
# View all services
kubectl get svc

# View all pods
kubectl get pods

# Restart specific service
kubectl rollout restart deployment frontend-deployment

# View logs of any pod
kubectl logs <pod-name>

# Delete all resources
kubectl delete -f k8s-all.yaml
kubectl delete -f configmap-secret.yaml
```

---

## ✅ Notes

- All ports are mapped using `NodePort`, no domain or ingress required
- No cloud is used, all runs locally
- Use Postman or browser to test any endpoint
- You can also docker pull images manually and test locally before pushing

---

## 🧭 Next Steps 

- Move to AWS EC2 or EKS
- Setup CI/CD using GitHub Actions

---

Happy Coding! 🚀
