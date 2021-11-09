import mongoose from 'mongoose';

const { Schema } = mongoose;

export const ProblemCode = new Schema({
  _id: String,
  code: String,
  testCode: [String],
  content: String,
});
