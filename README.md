# DEPLOYMENT DOCKER APP TO ECS & ECR

## PUSH IMAGE TO ECR USING GITHUB ACTIONS
main.yml berisi script untuk build image dan push ke ecr. untuk konfigurasi detail bisa di cek di file. reff github actions: https://github.com/marketplace?type=actions

## CONFIGURE ECS
### CRATE CLUSTER : lingkungan container 
1. create cluster
2. cluster name
3. infrastructure: fargate only
    - fargate only: full serverless, ini akan dimanaged oleh aws. ini yang paling mudah
    - fargate and managed instance: ini bisa menjalankan container di fargate dan ec2 yang akan di managed oleh ECS
    - fargate and self managed instance: ini dikelola secara manual. dari ketiganya ini yang paling ribet dan tricy, kemungkinan container bisa gagal jalan paling besar
4. create

###  TASK DEFINITION
task definition ini semacam template jadi berisi mendefinisikan beberapa paramater jadi saat create service akan menggunakan task definition ini
1. name
2. infrasturcture : launch type : fargate
3. Container > image : pilih ECR dan image terbaru > container port : ini di sesuaikan port appnya

### SERVICE
service ini digunakan untuk menjalankan dan mengelola sejumlah container secara terus menerus
1. Cluster > Service > Create
2. Select task definition
3. Environment: FARGATE
4. deplotment configuration: sesuaikan untuk desired task (minimal replika yang harus hidup)
5. Load Balancing --> disini setting load balancing sekalian agar bisa diakses pakai DNS. bisa tanpa alb jadi diakses pakai IP:port tapi di production mending pake ALB
   - ALB > load balancer name
   - create new listener : default
   - ceate nwe target group > target group name
6. create

### TESTING
http://ecs-loadbalancer-project-869205927.us-east-1.elb.amazonaws.com/ 

## CONFIGURE EKS
### CREATE CLUSTER
1. Create > custom configuration > name > iam role : labrole
2. Pilih VPC, Subnet, Security Group
3. next sampai create

### CREATE NODE GROUP
1. closter resource > create > node group
2. name > iam : labrole
3. instance type > configure scaling configuration
4. select subnet > create

### Connect EKS using cloudshell
```
aws eks update-kubeconfig --region us-east-1 --name eks_project
kubectl get nodes
```
setelah itu buat file deployment. lalu apply
```
kubectl apply -f deployment.yml
~ $ kubectl get all
NAME                                    READY   STATUS    RESTARTS   AGE
pod/nodejs-deployment-887d4db4b-4hrfk   1/1     Running   0          96m
pod/nodejs-deployment-887d4db4b-82pdq   1/1     Running   0          96m
pod/nodejs-deployment-887d4db4b-ts4p5   1/1     Running   0          96m

NAME                 TYPE           CLUSTER-IP     EXTERNAL-IP                                                               PORT(S)        AGE
service/app-lb       LoadBalancer   10.100.8.181   a66a7d748f48d4f46b37f42ec1099c91-1981811967.us-east-1.elb.amazonaws.com   80:31838/TCP   96m
service/kubernetes   ClusterIP      10.100.0.1     <none>                                                                    443/TCP        168m

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nodejs-deployment   3/3     3            3           96m

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/nodejs-deployment-887d4db4b   3         3         3       96m
```
untuk pengujian akses: a66a7d748f48d4f46b37f42ec1099c91-1981811967.us-east-1.elb.amazonaws.com
