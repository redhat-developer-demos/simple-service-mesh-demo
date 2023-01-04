# simple-service-mesh-demo

This project accompanies the article [NAME AND URL TO BE PROVIDED] published on the Red Hat Developer website.

The project has the configuration file and source code for working with an instance of OpenShift Service Mesh.

The folders in the project are as follows.

## K8S

The folder [K8S](./k8s/) has the YAML configuration files and setup script for getting the demonstration application's K8S resources running in an OpenShift/Kubernetes cluster.

## Service-Mesh

The folder [service-mesh](./service-mesh/) has the YAML configuration files for the Gateway, Virtual Services and Destination Rules needed to run the demonstration application under an OpenShift Service Mesh.

## src

The folder [src](./src/) contains the source code and buildah file for pushing the microservices written in Node.js as container image that are stored on quay.io located [TO BE PROVIDED].