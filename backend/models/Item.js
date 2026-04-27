import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0
    },
    category: {
      type: String,
      default: "General",
      trim: true
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
