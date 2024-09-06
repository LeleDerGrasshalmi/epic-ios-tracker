import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import dotenv from 'dotenv';

dotenv.config();

const envConfigScheme = Type.Object({
  WEBHOOK_URL: Type.Optional(Type.String()),

  GIT_DO_NOT_COMMIT: Type.Optional(Type.String({ default: 'false' })),
  GIT_DO_NOT_PUSH: Type.Optional(Type.String({ default: 'false' })),
  GIT_DO_NOT_SEND_WEBHOOK: Type.Optional(Type.String({ default: 'false' })),
});

const error = Value.Errors(envConfigScheme, process.env).First();

if (error) {
  throw new TypeError(`Invalid Environment Config: ${error.message} at ${error.path} (${error.type}), value is '${String(error.value)}'`);
}

export default Value.Decode(envConfigScheme, process.env);
