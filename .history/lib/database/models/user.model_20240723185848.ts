// clearid, email, username, photo, firstName, lastName, planID, creditBalance

import {Schema, models, model} from "mongoose"

const UserSchema = new Schema({
    clearId: { type: String, required: true},
    email: { type: String, required: true},
    username: { type: String, required: true},
    photo: { type: Image, required: true},
    firstname: { type: Schema.Types.ObjectId, ref: 'User'},

    createdAt: { type: Date, default: Date.now},

});

export default UserSchema;