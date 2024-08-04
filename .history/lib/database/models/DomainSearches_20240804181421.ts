import mongoose, { Schema, Document } from 'mongoose';

interface IDomainStatus {
  name: string;
  status: string;
  zone: string;
  summary: string;
}

interface IDomainSearch extends Document {
  userId: string;
  input: string;
  domains: IDomainStatus[];
  createdAt: Date;
}

const DomainStatusSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  zone: { type: String, required: true },
  summary: { type: String, required: true }
});

const DomainSearchSchema: Schema = new Schema({
  userId: { type: String, required: false },
  input: { type: String, required: true },
  domains: [DomainStatusSchema],
  createdAt: { type: Date, default: Date.now }
});

export defa