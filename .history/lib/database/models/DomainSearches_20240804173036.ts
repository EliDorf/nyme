import mongoose from 'mongoose';

const DomainSearchesSchema = new mongoose.Schema({
    userId: { type: String, required: false }, // Make it optional
    input: { type: String, required: true },
    suggestions: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  });

export default mongoose.models.NameSuggestion || mongoose.model('DomainSearches', DomainSearchesSchema);