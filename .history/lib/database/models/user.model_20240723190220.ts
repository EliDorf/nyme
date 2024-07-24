// clearid, email, username, photo, firstName, lastName, planID, creditBalance

import {Schema, models, model} from "mongoose"

const UserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    username: { type: String, required: true},
    photo: { type: String, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    planID: { type: Number, default:1},
    creditBalance: { type: Number, default:5},
    createdAt: { type: Date, default: Date.now},

});

export default UserSchema;