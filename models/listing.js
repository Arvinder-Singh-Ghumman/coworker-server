import mongoose, { Schema } from "mongoose";  

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // from user model
      required: true,
    },
    picturePath: {
      type: Array,
      default: [],
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    reviews: {
      type: Array,
      default: []
    },
    seating: Number,
    description: String,
    term: String,
    availability: String,
    isSmokingAllowed: Boolean,
    impressions: Number,
    neighborhood: String,
    squareFeet: Number,
    hasParking: Boolean,
    hasPublicTransportation: Boolean,
  },{timestamps: true }
)

const Listing = mongoose.model("Listing",ListingSchema)

export default Listing;