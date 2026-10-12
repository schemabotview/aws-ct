import type { Scene } from '@graphlearning/flow'

// §9.3 — parameters (Env, image tag), outputs and exports, and where secrets go. The template linted
// clean generates its secret inside Secrets Manager, so no value ever appears in the template, the
// parameters or a build log. The program runs cfn-lint on two versions of a database: the hard-coded
// password is flagged (W2501); RDS-managed master password passes. NoEcho does not mask Outputs or
// Metadata; dynamic references are the recommended route.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references-secretsmanager.html
export const paramsAndSecrets: Scene = {
  id: 'params-and-secrets',
  title: 'Configuration in, secrets never',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'template',
      kind: 'code',
      filename: 'config.yaml · model-checked',
      hug: true,
      label: `AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  Env:
    Type: String
    AllowedValues: [dev, prod]
  AppImageTag:
    Type: String
Resources:
  AppConfig:
    Type: AWS::SSM::Parameter
    Properties:
      Name: !Sub /shop/\${Env}/order-api/image-tag
      Type: String
      Value: !Ref AppImageTag
  ApiKeySecret:
    Type: AWS::SecretsManager::Secret
    Properties:
      Name: !Sub shop/\${Env}/payments-api-key
      GenerateSecretString:
        PasswordLength: 40
        ExcludePunctuation: true
Outputs:
  ApiKeySecretArn:
    Value: !Ref ApiKeySecret
    Export:
      Name: !Sub shop-\${Env}-payments-secret`,
    },
    {
      id: 'lint',
      label: 'cfn-lint on two database templates',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'secrets',
          kind: 'code',
          filename: 'secrets_lint.py · runs locally',
          hug: true,
          label: `from cfnlint.api import ManualArgs, lint

BASE = """AWSTemplateFormatVersion: "2010-09-09"
Resources:
  OrdersDb:
    Type: AWS::RDS::DBInstance
    DeletionPolicy: Snapshot
    UpdateReplacePolicy: Snapshot
    Properties:
      Engine: postgres
      DBInstanceClass: db.m7g.large
      AllocatedStorage: "100"
      MasterUsername: shop_admin
      {secret}
"""
versions = {
    "hard-coded": "MasterUserPassword: Sup3rSecret!",
    "managed": "ManageMasterUserPassword: true",
}
for name, line in versions.items():
    found = lint(BASE.format(secret=line),
                 config=ManualArgs(regions=["eu-west-2"]))
    print(f"{name}:", [f"{m.rule.id} {m.message[:44]}" for m in found]
          or "no findings")`,
        },
        {
          id: 'secrets-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `hard-coded: ["W2501 Password shouldn't be hardcoded for Resource"]
managed: no findings`,
        },
      ],
    },
  ],
  edges: [],
}
