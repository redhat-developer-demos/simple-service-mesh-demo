# simple-service-mesh
The project provides the services that will be used to demonstrate how to configure and run a microservice oriented architecture under an Istio service mesh.

This project has three Node.Js applications, `Orders`, `Payments` and `Recommendations`. Each application is to be run as a distinct service under Kubernetes. Once the services are installed, they are intended to be managed by an Istio service mesh that has been installed on the targeted Kubernetes cluster.

The dependency chain for the services is that `Orders` uses both `Payments` and `Recommendations`. See the `readme` files in each subordinate project to learn the details for running the given service.

Each service is intended to be encapsulated and deployed as a Linux container image hosted in a container image registry and then deployed into a Kubernetes cluster as a container.

The bash script for building and pushing container images to a container registry using [`buildah`](https://buildah.io/) is [buildah.sh](buildah.sh). The script's default container registry is `quay.io`. Adjust the bash script accordingly to meet your needs. 
