import Listing from "../models/listing.js";
import jwt from "jsonwebtoken";

async function getListing(req, res) {
  try {
    // getting listing
    const listingPage = req.query.p;
    const listingId = req.query.id;

    var listing;
    if (listingId) {
      listing = await Listing.findById(listingId);
    } else if (listingPage) {
      listing = await Listing.find()
        .skip(listingPage * 10)
        .limit(10);
    } else {
      listing = await Listing.aggregate([
        { $sample: { size: 10 } }, // Fetch a random sample of 10 listings
        {
          $lookup: {
            // Populate the owner field
            from: "users",
            localField: "owner",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
            as: "owner",
          },
        },
        { $unwind: "$owner" }, // Flatten the owner array
      ]);
    }

    if (!listing) {
      return res.status(404).json({ message: "Listing does not exist" });
    }

    // sending listing
    return res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function addListing(req, res) {
  try {
    var data = req.body;

    //creating listing
    try {
      await Listing.create(data);
      return res.status(201).json({ message: "Listing successfully created" });
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateListing(req, res) {
  try {
    //getting user using id
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    // no user found
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Update listing
    if (req.body.title) {
      listing.title = req.body.title;
    }
    if (req.body.picturePath) {
      listing.picturePath = req.body.picturePath;
    }
    if (req.body.category) {
      listing.category = req.body.category;
    }
    if (req.body.price) {
      listing.price = req.body.price;
    }
    if (req.body.location) {
      listing.location = req.body.location;
    }
    if (req.body.seating) {
      listing.seating = req.body.seating;
    }
    if (req.body.term) {
      listing.term = req.body.term;
    }
    if (req.body.description) {
      listing.description = req.body.description;
    }
    if (req.body.availability) {
      listing.availability = req.body.availability;
    }
    if (req.body.isSmokingAllowed) {
      listing.isSmokingAllowed = req.body.isSmokingAllowed;
    }
    if (req.body.neighborhood) {
      listing.neighborhood = req.body.neighborhood;
    }
    if (req.body.squareFeet) {
      listing.squareFeet = parseInt(req.body.squareFeet);
    }
    if (req.body.hasParking !== undefined) {
      listing.hasParking = req.body.hasParking;
    }
    if (req.body.hasPublicTransportation !== undefined) {
      listing.hasPublicTransportation = req.body.hasPublicTransportation;
    }

    // Save the updated user object
    await listing.save();

    //sending user object (excluding password)
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteListing(req, res) {
  const listingId = req.params.id;

  try {
    // Find the listing by ID and delete it
    const deletedUser = await Listing.findByIdAndDelete(listingId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    // If an error occurs during database operation, respond with internal server error
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function searchByTitle(req, res) {
  try {
    // getting listing
    const key = req.params.key;

    var listing;
    if (key) {
      listing = await Listing.aggregate([
        { $match: { title: { $regex: key, $options: "i" } } },
        {
          $lookup: {
            // Populate the owner field
            from: "users",
            localField: "owner",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
            as: "owner",
          },
        },
        { $unwind: "$owner" }, // Flatten the owner array
      ]);
    }

    if (!listing) {
      return res.status(404).json({ message: "No results found" });
    }

    // sending listing
    return res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
async function searchListing(req, res) {
  try {
    var listings;
    var pipeline = [];

    var { minPrice, maxPrice } = req.query;

    // category
    if (req.query.category) {
      pipeline.push({
        $match: { category: { $regex: req.query.category, $options: "i" } },
      });
    }
    //price
    if (minPrice && maxPrice) {
      pipeline.push({
        $match: {
          price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) },
        },
      });
    } else if (minPrice) {
      pipeline.push({ $match: { price: { $gte: parseInt(minPrice) } } });
    } else if (maxPrice) {
      pipeline.push({ $match: { price: { $lte: parseInt(maxPrice) } } });
    }
    //page
    if (req.query.page) {
      pipeline.push({ $limit: req.query.page * 10 });
    } else {
      pipeline.push({ $limit: 10 });
    }
    //other all params
    if (req.query.address) {
      pipeline.push({
        $match: { address: { $regex: req.query.address, $options: "i" } },
      });
    }
    if (req.query.neighborhood) {
      pipeline.push({ $match: { neighborhood: req.query.neighborhood } });
    }
    if (req.query.squareFeet) {
      pipeline.push({ $match: { squareFeet: parseInt(req.query.squareFeet) } });
    }
    if (req.query.hasParking) {
      pipeline.push({
        $match: { hasParking: req.query.hasParking === "true" },
      });
    }
    if (req.query.hasPublicTransportation) {
      pipeline.push({
        $match: {
          hasPublicTransportation: req.query.hasPublicTransportation === "true",
        },
      });
    }
    if (req.query.seatingCapacity) {
      pipeline.push({
        $match: { seatingCapacity: parseInt(req.query.seatingCapacity) },
      });
    }
    if (req.query.isSmokingAllowed) {
      pipeline.push({
        $match: { isSmokingAllowed: req.query.isSmokingAllowed === "true" },
      });
    }
    if (req.query.availabilityDate) {
      pipeline.push({
        $match: { availabilityDate: new Date(req.query.availabilityDate) },
      });
    }
    if (req.query.term) {
      pipeline.push({ $match: { term: req.query.term } });
    }

    //populating the listings
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
        as: "owner",
      },
    });
    pipeline.push({ $unwind: "$owner" });

    listings = await Listing.aggregate(pipeline);

    if (!listings) {
      return res.status(404).json({ message: "No results found" });
    }
    // sending listing
    return res.status(200).json(listings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  getListing,
  addListing,
  updateListing,
  deleteListing,
  searchByTitle,
  searchListing,
};
