#!/usr/bin/env bash

REPO_USER_NAME=<PUT_YOUR_REPO_USER_NAME_HERE>
REPO_URL=quay.io

# Payments
cd ./payments
buildah bud -t service-mesh-payments Containerfile
buildah push localhost/service-mesh-payments $REPO_URL/$REPO_USER_NAME/service-mesh-payments:v1.0

cd ..

cd ./recommendations
buildah bud -t service-mesh-recommendations Containerfile
buildah push localhost/service-mesh-recommendations $REPO_URL/$REPO_USER_NAME/service-mesh-recommendations:v1.0

cd ..

cd ./orders
buildah bud -t service-mesh-orders Containerfile
buildah push localhost/service-mesh-orders $REPO_URL/$REPO_USER_NAME/service-mesh-orders:v1.0


