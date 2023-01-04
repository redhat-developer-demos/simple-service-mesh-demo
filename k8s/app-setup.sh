echo "Setting up namespace"

kubectl apply -f namespace.yaml

echo "Applying the namespace to the service mesh member roll"

kubectl replace -f service-member-roll.yaml

echo "Setting up recommendations"

kubectl apply -f recommendations.yaml

echo "Setting up payments"

kubectl apply -f payments.yaml

echo "Setting up orders"

kubectl apply -f orders.yaml

echo "The non-service mesh route to the API is in the following output:"

kubectl get routes -n service-mesh-demo
