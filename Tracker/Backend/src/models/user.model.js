import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        profileImage: {
            type: String,
            default:
                "https://ik.imagekit.io/teim9v6vi/default%20profile%20image.webp?updatedAt=1771729885407",
            trim: true,
        },
        bio: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
