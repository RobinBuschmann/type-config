# type-config
Type safe way of loading environment variables and arguments in node.

## Installation
```bash
npm install type-config --save
```
*type-config* requires [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
```
npm install reflect-metadata --save
```
Your `tsconfig.json` needs the following flags:
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

## Getting started
##### Setup configuration class
```typescript
class DataBaseConfiguration {
    @EnvValue('DB_HOST') host: string = 'localhost';
    @EnvValue('DB_NAME') name: string;
    @EnvValue('DB_PORT') port: number;
}
```
```typescript
class LoggingConfiguration {
    @ArgsValue('log-level') level: string;
    @ArgsValue('silent') silent: boolean;
}
```
```json
{
  "auth": {
    "jwt": {
      "issuer": "type-config"
    },
    "timestamp": "2018-05-27T17:35:54.391Z"
  }
}
```
```typescript
@JsonConfiguration(`${__dirname}/config.json`)
class AuthConfiguration {
    @JsonValue('auth.jwt.issuer') jwtIssuer: string = 'type-config';
    @JsonValue('auth.timestamp') timestamp: Date;
}
```
##### Run application
```bash
DB_HOST='127.0.0.1' /
DB_NAME='type-config' /
DB_PORT='1234' /
node app.js --log-level info --silent
```
