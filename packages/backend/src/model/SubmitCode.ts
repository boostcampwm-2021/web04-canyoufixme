import mongoose from 'mongoose';

const { Schema } = mongoose;

export const SubmitCode = new Schema({
  _id: Number,
  code: String,
});
