import mongoose from 'mongoose';

const { Schema } = mongoose;

export const ProblemCode = new Schema({
  code: String,
  testCode: [String],
  content: String,
});
