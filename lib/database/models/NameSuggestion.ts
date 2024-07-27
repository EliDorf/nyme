import mongoose from 'mongoose';

const NameSuggestionSchema = new mongoose.Schema({
    clerkId: { type: String, required: false }, // Make it optional
    input: { type: String, required: true },
    suggestions: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  });
  
export default mongoose.models.NameSuggestion || mongoose.model('NameSuggestion', NameSuggestionSchema);