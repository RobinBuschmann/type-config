[![Build Status](https://travis-ci.org/RobinBuschmann/type-config.svg?branch=master)](https://travis-ci.org/RobinBuschmann/type-config)
[![codecov](https://codecov.io/gh/RobinBuschmann/type-config/branch/master/graph/badge.svg)](https://codecov.io/gh/RobinBuschmann/type-config)

# type-env
Type safe way defining configurations fed by environment variables, process arguments or json config files 
(including deserialization and validation).

## Installation
```bash
npm install type-env --save
```
*type-env* requires [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
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
#### Setup configuration class
```typescript
import {EnvValue} from 'type-env';
class DataBaseConfiguration {
    @EnvValue('DB_HOST') host: string = 'localhost';
    @EnvValue('DB_NAME') name: string;
    @EnvValue('DB_PORT') port: number;
}
```
```typescript
import {ArgsValue} from 'type-env';
class LoggingConfiguration {
    @ArgsValue('log-level') level: string;
    @ArgsValue('silent') silent: boolean;
}
```
```json
{
  "auth": {
    "jwt": {
      "issuer": "type-env"
    },
    "timestamp": "2018-05-27T17:35:54.391Z"
  }
}
```
```typescript
import {JsonConfiguration, JsonValue} from 'type-env';
@JsonConfiguration(`${__dirname}/config.json`)
class AuthConfiguration {
    @JsonValue('auth.jwt.issuer') jwtIssuer: string = 'type-env';
    @JsonValue('auth.timestamp') timestamp: Date;
}
```
#### Run application
```bash
DB_HOST='127.0.0.1' /
DB_NAME='type-env' /
DB_PORT='1234' /
node app.js --log-level info --silent
```

## Options
```typescript
import {buildDecorators, NodeEnvConfigSource, NodeArgsConfigSource, JsonConfigSource} from 'type-env';

const {Value, EnvValue, ArgsValue, JsonValue} = buildDecorators({
    /**
     * Enables validation if true. Throws if config value is invalid.
     * @default true
     */
    validate: true,
    
    /**
     * Throws if value does not exist on source.
     * @default true
     */
    required: true,
    
    /**
     * If true, loads config value when property is accessed.
     * @default true
     */
    lazyLoad: true,

    /**
     * Do not throw on validation or requirement errors, but logs a warning instead.
     * @default false
     */
    warnOnly: false,
    
    /**
     * Map of decorator key name and config source.
     * @default {
                    Value: NodeEnvConfigSource,
                    EnvValue: NodeEnvConfigSource,
                    ArgsValue: NodeArgsConfigSource,
                    JsonValue: JsonConfigSource,
                }
     */
    decoratorMeta: {
        Value: NodeEnvConfigSource,
        EnvValue: NodeEnvConfigSource,
        ArgsValue: NodeArgsConfigSource,
        JsonValue: JsonConfigSource,
    }
})
```
