import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id:string;
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export interface Users extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerify: boolean;
  isMsgAccept: boolean;
  messages: Message[];
}

const userSchema: Schema<Users> = new Schema(
  {
    username: {
      type: String,
      required: [true, "please provide username"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please provide eamil"],
      trim: true,
      unique: true,
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
        "please provide valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "please provide password"],
    },
    verifyCode: {
      type: String,
      required: [true, "please provide verifyCode"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "please provide verify code expiry"],
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    isMsgAccept: {
      type: Boolean,
      default: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const userModel =
  (mongoose.models.User as mongoose.Model<Users>) ||
  mongoose.model<Users>("User", userSchema);

export default userModel;
