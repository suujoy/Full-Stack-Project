import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
{
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],

    isGroup: {
        type: Boolean,
        default: false
    },

    groupName: {
        type: String,
        trim: true
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
},
{ timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;