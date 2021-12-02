import mongoose from 'mongoose';
import type { ISubmitCode } from '@cyfm/types';

const { Schema } = mongoose;

export const SubmitCode = new Schema<ISubmitCode>({
  code: String,
  testResult: [String],
});
