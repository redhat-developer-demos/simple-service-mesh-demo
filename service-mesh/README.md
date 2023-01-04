# openshift-service-mesh-examples

**UNDER CONSTRUCTION**

Get the URL to the application route by way of the service mesh

```
GATEWAY_URL=$(oc -n istio-system get route istio-ingressgateway -o jsonpath='{.spec.host}') && echo $GATEWAY_URL
```
