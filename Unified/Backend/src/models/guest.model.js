import mongoose from "mongoose";

// A guest is a temporary visitor who only provided their name.
// They can only access the Unified Test Room.
const guestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sessionId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const GuestModel = mongoose.model("Guest", guestSchema);
export default GuestModel;
