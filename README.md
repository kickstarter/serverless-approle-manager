## Vault AppRole Manager

**Required:** Before using this lambda you will need a policy written in Vault specific to your app and environment.

To use this lambda in a CFN template:

```
LambdaVaultAuth:
  Type: Custom::VaultAuth
  Properties:
    ServiceToken: 'arn:aws:lambda:us-east-1:11111111111:function:serverless-approle-manager'
    Service: MyAppName
    Environment: MyEnv
    Iam:
      Ref: MyIamRole
```

In case of a **CREATE** event, this lambda will create a role in Vault for your service, and retrieve the corresponding role-id and secret-id, and put them securely (server side encryption enabled) in S3.

These credentials can then be pulled by a service to generate a client token to access Vault.

In case of a **DELETE** event, this lambda will delete the corresponding role on Vault.

In case of a **UPDATE** event, this lambda will delete the old role and create a new one.
