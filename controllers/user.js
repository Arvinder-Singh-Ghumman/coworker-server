import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function getUser(req, res) {
  try {
    // getting user using token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY);
    // Find the user by ID and exclude the password field
    const user = await User.findById(decoded.id, { password: 0 });

    if (!user) {
      // user not found
      return res.status(404).json({ message: "User not found" });
    }

    // sending user object (excluding password)
    return res.status(200).json(user);
  } catch (error) {
    // If an error occurs during token verification or database operation, respond with internal server error
    return res.status(500).json(error);
  }
}
async function getUserById(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findById(id, { password: 0 });

    if (!user) {
      // user not found
      return res.status(404).json({ message: "User not found" });
    }

    // sending user object (excluding password)
    return res.status(200).json(user);
  } catch (error) {
    // If an error occurs during token verification or database operation, respond with internal server error
    return res.status(500).json({ message: error });
  }
}

async function addUser(req, res) {
  try {
    var data = req.body;
    const saltRounds = 10;

    //checking that email does not exist
    var user = await User.findOne({ email: data.email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //encrypting the password
    const hash = bcrypt.hashSync(data.password, saltRounds);
    data.password = hash;

    //creating user
    try {
      const newUser = await User.create(data);
      const token = jwt.sign(
        { role: newUser.role, id: newUser._id },
        process.env.KEY,
        { expiresIn: "7d" }
      );
      return res.status(201).json({ token });
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function logIn(req, res) {
  try {
    var { email, password } = req.body;

    //getting user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //checking password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result) {
        // passwords match
        const token = jwt.sign(
          { role: user.role, id: user._id },
          process.env.KEY,
          { expiresIn: "7d" }
        );
        return res.status(200).json({ token });
      } else {
        //password dont match
        return res.status(401).json({ message: "wrong password" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addReview(req, res) {
  try {
    //getting user using id
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY);
    let byUser = await User.findById(decoded.id);

    //getting user using id
    const id = req.params.id;
    const user = await User.findById(id)
    
    // no user found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    if (req.body) {
      const review = req.body;
      review.by = { id: byUser._id, name: byUser.name, picturePath: byUser.picturePath };
      console.log(review)
      user.reviews = review;
    }
    // Save the updated user object
    await user.save();

    // sending updated user (excluding the password)
    const updatedUser = await User.findById(id, { password: 0 });

    if (!updateUser) {
      // user not found
      return res
        .status(500)
        .json({
          message: "update was success but error occured at a later stage",
        });
    }

    //sending user object (excluding password)
    return res.status(200).json({message: "Review added", updatedUser});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    //getting user using id
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await User.findById(decoded.id)
    
    // no user found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.picturePath) {
      user.picturePath = req.body.picturePath;
    }
    if (req.body.phone) {
      user.phone = req.body.phone;
    }
    if (req.body.password) {
      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      user.password = hashedPassword;
    }

    // Save the updated user object
    await user.save();

    // sending updated user (excluding the password)
    const updatedUser = await User.findById(decoded.id, { password: 0 });

    if (!updateUser) {
      // user not found
      return res
        .status(500)
        .json({
          message: "update was success but error occured at a later stage",
        });
    }

    //sending user object (excluding password)
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteUser(req, res) {
  try {
    //getting user using id
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY);
    let user = await User.findById(decoded.id);
    
    if (!user) {
      // If user is not found, respond with 404 Not Found status
      return res.status(404).json({ message: "User not found" });
    }
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(decoded.id);

    // Respond with a success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // If an error occurs during database operation, respond with internal server error
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export { addUser, logIn, getUser, addReview, getUserById, deleteUser, updateUser };
