import mongoose from "mongoose";

const savedLinkSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: [true, "URL is required"],
            unique: true,
            trim: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        
        description: {
            type: String,
            default: "",
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true },
);

const savedLinkModel = mongoose.model("SavedLink", savedLinkSchema);

export default savedLinkModel;
