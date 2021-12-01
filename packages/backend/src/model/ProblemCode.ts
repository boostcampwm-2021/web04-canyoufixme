import mongoose from 'mongoose';
import type { IProblemCode } from '@cyfm/types';

const { Schema } = mongoose;

export const ProblemCode = new Schema<IProblemCode>({
  code: String,
  testCode: [String],
  content: String,
});
