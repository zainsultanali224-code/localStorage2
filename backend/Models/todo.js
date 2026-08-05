// Schema

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    number: {
      type: Number,
    },

    desc: {
      type: String,
      trim: true,
    },

    range: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },

    color: {
      type: String,
      default: "#000000",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    gender: {
      type: String,
      required: true,
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married"],
      required: true,
    },

    children: {
      type: Number,
      min: 0,
      required: function () {
        return this.maritalStatus === "Married";
      },
    },

    country: {
      type: String,
      default: "Pakistan",
    },
  },
  {
    timestamps: true,
  }
);

todoSchema.plugin(mongoosePaginate);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;