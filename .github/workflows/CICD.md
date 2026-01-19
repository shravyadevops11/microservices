name: Build & Deploy

on:
  push:
    branches: [ "main" ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    # ---------------- Build Docker Images ----------------
    - name: Build images
      run: |
        docker build -t ${{ secrets.DOCKER_USER }}/config-service:latest ./config-service
        docker build -t ${{ secrets.DOCKER_USER }}/log-aggregator:latest ./log-aggregator-service

    # ---------------- Push Docker Images ----------------
    - name: Push images
      run: |
        echo "${{ secrets.DOCKER_PASS }}" | docker login -u "${{ secrets.DOCKER_USER }}" --password-stdin
        docker push ${{ secrets.DOCKER_USER }}/config-service:latest
        docker push ${{ secrets.DOCKER_USER }}/log-aggregator:latest

    # ---------------- Setup kubectl ----------------
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: v1.29.0

    # ---------------- Configure Kubeconfig ----------------
    - name: Configure kubeconfig
      run: |
        mkdir -p $HOME/.kube
        echo "${{ secrets.KUBECONFIG }}" | base64 --decode > $HOME/.kube/config

    # ---------------- Deploy to Kubernetes ----------------
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/mysql.yaml
        kubectl apply -f k8s/redis.yaml
        kubectl apply -f k8s/config-service.yaml
        kubectl apply -f k8s/log-aggregator.yaml

        kubectl rollout status deployment/config-service
        kubectl rollout status deployment/log-aggregator

        =======================================================

        # This is by passing secrets as Env variables (Not as Github secrets)

name: Build & Deploy

on:
  push:
    branches: [ "main" ]

env:
  NAMESPACE: default  # Change to your target namespace
  DOCKER_REGISTRY: ${{ secrets.DOCKER_USER }}
  DOCKER_PASSWORD: ${{ secrets.DOCKER_PWD }}

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    # ---------------- Build Docker Images ----------------
    - name: Build images
      run: |
        docker build -t ${{ env.DOCKER_REGISTRY }}/config-service:latest ./config-service
        docker build -t ${{ env.DOCKER_REGISTRY }}/log-aggregator:latest ./log-aggregator-service

    # ---------------- Push Docker Images ----------------
    - name: Push images
      run: |
        echo "${{ secrets.DOCKER_PASS }}" | docker login -u "${{ secrets.DOCKER_USER }}" --password-stdin
        docker push ${{ env.DOCKER_REGISTRY }}/config-service:latest
        docker push ${{ env.DOCKER_REGISTRY }}/log-aggregator:latest

    # ---------------- Setup kubectl ----------------
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: v1.29.0

    # ---------------- Configure Kubeconfig ----------------
    - name: Configure kubeconfig
      run: |
        mkdir -p $HOME/.kube
        echo "${{ secrets.KUBECONFIG }}" | base64 --decode > $HOME/.kube/config

    # ---------------- Deploy to Kubernetes ----------------
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/mysql.yaml -n ${{ env.NAMESPACE }}
        kubectl apply -f k8s/redis.yaml -n ${{ env.NAMESPACE }}
        kubectl apply -f k8s/config-service.yaml -n ${{ env.NAMESPACE }}
        kubectl apply -f k8s/log-aggregator.yaml -n ${{ env.NAMESPACE }}

        kubectl rollout status deployment/config-service -n ${{ env.NAMESPACE }}
        kubectl rollout status deployment/log-aggregator -n ${{ env.NAMESPACE }}

