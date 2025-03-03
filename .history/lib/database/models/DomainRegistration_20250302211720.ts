import mongoose, { Document, Schema } from 'mongoose';

interface IDomainRegistration extends Document {
  userId: string;
  domainName: string;
  registrationDate: Date;
  price: number;
  currency: string;
  status: string; // 'initiated', 'completed', etc.
  affiliateLink: string;
}

const DomainRegistrationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  domainName: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  status: { type: String, required: true, default: 'initiated' },
  affiliateLink: { type: String, required: true }
});

export default mongoose.models.DomainRegistration || 
  mongoose.model<IDomainRegistration>('DomainRegistration', DomainRegistrationSchema); 