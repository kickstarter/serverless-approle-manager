#!/bin/bash
# This is an example on how we use envconsul to set the secrets in our container environment after retrieving a Vault token.
# Your container will need the aws cli tools to run this script.
set -e

VAULT_SERVER="your Vault's server address"
S3_BUCKET="Your S3 bucket"

if [[ -z "${AWS_CONTAINER_CREDENTIALS_RELATIVE_URI}" ]]; then
  iamRole=`curl http://169.254.169.254/latest/meta-data/iam/security-credentials/`
else
  iamRole=`curl 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI | jq -r .RoleArn`
fi

creds=`aws s3 cp s3://$S3_BUCKET/vault/appRole/$iamRole -`
VAULT_TOKEN=`curl --max-time 30 -s -XPOST "https://$VAULT_SERVER:8200/v1/auth/approle/login" -d $creds | jq -r .auth.client_token`
export VAULT_TOKEN
dockerize -delims "<%:%>" -template /ksr_base/envconsul-config.hcl.tmpl:/ksr_base/envconsul-config.hcl echo "Done templating"

#Set up  variables
envconsul -once -config="/ksr_base/envconsul-config.hcl" env | while read line ; do if [[ ! "$line" == "" ]]; then echo "export '$line'" >> /ksr_base/variables ;fi done
source /ksr_base/variables
rm /ksr_base/variables

exec "$@"
