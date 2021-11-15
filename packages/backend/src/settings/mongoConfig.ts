import { connect, model } from 'mongoose';

import { ProblemCode } from '../model/ProblemCode';
import { SubmitCode } from '../model/SubmitCode';

async function mongoConnection(): Promise<void> {
  await connect(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.DB_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}${process.env.MONGO_OPTION}`,
  );
}

mongoConnection().catch(err => {
  throw new Error(err);
});

const ProblemCodeModel = model('problemCode', ProblemCode);
const SubmitCodeModel = model('submitCode', SubmitCode);

ProblemCodeModel.createCollection();
SubmitCodeModel.createCollection();

export { ProblemCodeModel, SubmitCodeModel };
