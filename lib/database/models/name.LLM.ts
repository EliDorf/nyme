import {Schema, models, model} from "mongoose"

const NameSchema = new Schema({
    title: { type: String, required: true},
    publicID: { type: String, required: true},
    variation: { type: String, required: true},
    prompt: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date, default: Date.now},

});

export default NameSchema;