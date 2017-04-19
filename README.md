## Vault AppRole Manager

After receiving a few requests we decided to open source our AWS lambda code following this [blog post](https://kickstarter.engineering/ecs-vault-shhhhh-i-have-a-secret-40e41af42c28).

**Prerequisites:**
 - Before using this lambda you will need a policy written in Vault specific to your app and environment, the policy should be named `<app>-<environment>` for example `kickstarter-dev`.
 - You will need to create a Vault token with restricted access to Vault and store it in S3.
 - You will need AWS credentials.
 - You will need to add a `local.yml` file at the root of the directory with all the variables specific to your environment.
 - You will need to add your own SSL certificate `ca.pem`at the root as well.
  - We use serverless to deploy our lambdas, install with `npm install serverless -g` and deploy with `serverless deploy`

## How does this work ?

This AWS lambda leverages the [AppRole Authentication](https://www.vaultproject.io/docs/auth/approle.html) method offered by Hashicorp's Vault.
When a new container starts it runs an entrypoint script that will retrieve a Vault token by using the secret id and role id stored on S3, in a directory named after its own task role. This will allow the container to populate its environment with all the secrets. An example of this entrypoint script is included in the Docker folder.

To trigger this lambda in an AWS CloudFormation template, add this to your template:

```
LambdaVaultAuth:
  Type: Custom::VaultAuth
  Properties:
    ServiceToken: 'arn:aws:lambda:us-east-1:11111111111:function:serverless-approle-manager'
    Service: MyAppName
    Environment: MyEnv
    Iam:
      Ref: MyECSTaskRole
```

In case of a **CREATE** event, this lambda will create a role in Vault for your service, and retrieve the corresponding role-id and secret-id, and put them securely (server side encryption enabled) in S3.

These credentials can then be pulled by a service to generate a client token to access Vault.

In case of a **DELETE** event, this lambda will delete the corresponding role on Vault.

In case of a **UPDATE** event, this lambda will delete the old role and create a new one.
