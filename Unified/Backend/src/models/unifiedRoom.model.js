import mongoose from "mongoose";

// Separate collection for Unified Test Room messages.
// Senders can be either a registered User or a Guest.
const unifiedRoomMessageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        // Either guestId or userId will be set, not both
        guestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guest",
            default: null,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        // Denormalised sender name so we don't need a join for display
        senderName: {
            type: String,
            required: true,
        },
        isGuest: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const UnifiedRoomMessage = mongoose.model(
    "UnifiedRoomMessage",
    unifiedRoomMessageSchema
);
export default UnifiedRoomMessage;
