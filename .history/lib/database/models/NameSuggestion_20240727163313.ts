import mongoose from 'mongoose';

const NameSuggestionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  input: { type: String, required: true },
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.NameSuggestion || mongoose.model('NameSuggestion', NameSuggestionSchema);