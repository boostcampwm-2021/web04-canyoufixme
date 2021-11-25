import mongoose from 'mongoose';

const { Schema } = mongoose;

export const SubmitCode = new Schema({
  code: String,
  testResult: [String],
});
