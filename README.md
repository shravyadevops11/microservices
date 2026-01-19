#Kubectl CLI Commands to Create Deployment/Service or Anything
==================================================================
alias k=kubectl

# Step 1: Create deployment
kubectl create deployment mysql --image=mysql:8.0 --replicas=1
kubectl create deployment mysql --image=mysql:8.0 --replicas=1 --dry-run=client -o yaml > mysql-deployment.yaml


# Step 2: Set root password
kubectl set env deployment/mysql MYSQL_ROOT_PASSWORD=mypassword123

# 3. Expose as service
kubectl expose deployment mysql --port=3306 --target-port=3306 --name=mysql-service

4. To set resource limits
kubectl set resources deployment/mysql --limits=cpu=500m,memory=1Gi --requests=cpu=250m,memory=512Mi

==========================================================

### For Redis - Create deployment
kubectl create deployment redis   --image=redis:7-alpine  --replicas=1  --port=6379

# Step 2: Set requests/limits
kubectl set resources deployment/redis   --requests=cpu=100m,memory=128Mi   --limits=cpu=250m,memory=256Mi

# 3. Expose as service
kubectl expose deployment redis   --port=6379   --target-port=6379   --name=redis-service   --type=ClusterIP

===============================
# Exit 0 -> To fix this with sleep
kubectl create deployment my-dep --image=busybox --port=5701 -- sleep 3600

kubectl logs -l app=my-dep --tail=10

# Check if API server is running
kubectl get nodes

# If connection refused, check cluster status
systemctl status kubelet
systemctl status kube-apiserver

==================================
# Few Important Commands
kubectl version

kubectl config view --raw
echo $KUBECONFIG
# If empty, default is used:
 ls -la ~/.kube/config 
 
export KUBECONFIG=~/.kube/config
 
kubectl config get-contexts
kubectl auth whoami
 



