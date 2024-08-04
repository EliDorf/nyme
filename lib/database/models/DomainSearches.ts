import mongoose from 'mongoose';


const DomainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    zone: { type: String, required: true },
    summary: { type: String, required: true }
  });
  
  const DomainSearchesSchema = new mongoose.Schema({
    userId: { type: String, required: false }, // Make it optional
    input: { type: String, required: true },
    domains: [DomainSchema],
    createdAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.models.DomainSearches || mongoose.model('DomainSearches', DomainSearchesSchema);