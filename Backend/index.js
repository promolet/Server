const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors"); // Fixed typo: changed "cros" to "cors"
const Cart = require('./models/Cart.js');
const User = require('./models/User.js')
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { Sequelize } = require('sequelize');
const Address = require('./models/Address.js');
const Order = require('./models/Order.js');
const Wishlist = require('./models/Wishlist.js');
const Contact = require('./models/Contact.js');
const Course = require('./models/Course.js');
const Product = require('./models/Product.js')
const bodyParser = require("body-parser");
const path = require("path");
const AdminUsers = require('./models/AdminUser.js');
const Razorpay = require('razorpay');
const ErrorCode = require('./models/Acerror.js');
const nodemailer = require('nodemailer');
const CourseOrder = require('./models/CourseOrder.js');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files from uploads folder

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  const getShiprocketToken = async () => {
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/auth/login",
        {
          email: SHIPROCKET_EMAIL,
          password: SHIPROCKET_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.token;
    } catch (error) {
      console.error("Error authenticating with Shiprocket:", error);
      throw new Error("Authentication failed.");
    }
  };
  
  // 2. Create a shipment (order)
  const createShipment = async (accessToken, orderData) => {
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/forward",
        orderData,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // Returns shipment details such as AWB (Airway Bill) number
    } catch (error) {
      console.error("Error creating shipment", error);
      throw new Error("Failed to create shipment.");
    }
  };
  
  // 3. Track shipment using AWB number
  const trackShipment = async (accessToken, awbNumber) => {
    try {
      const response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/track/awb/${awbNumber}`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      return response.data; // Returns tracking status
    } catch (error) {
      console.error("Error tracking shipment", error);
      throw new Error("Failed to track shipment.");
    }
  };
  
  // 4. Fetch shipping rates based on product details
  const getShippingRates = async (accessToken, shippingDetails) => {
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/estimate",
        shippingDetails,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // Returns the shipping rate
    } catch (error) {
      console.error("Error fetching shipping rates", error);
      throw new Error("Failed to fetch shipping rates.");
    }
  };
  
  // API Endpoint to create an order

  // API Endpoint to track shipment
  app.get('/track-shipment/:awbNumber', async (req, res) => {
    try {
      const token = await getShiprocketToken();
      const trackingStatus = await trackShipment(token, req.params.awbNumber);
      res.json(trackingStatus);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
  // API Endpoint to get shipping rates
  app.post('/shipping-rates', async (req, res) => {
    try {
      const token = await getShiprocketToken();
      const shippingDetails = req.body.shippingDetails;
      const rates = await getShippingRates(token, shippingDetails);
      res.json(rates);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  // Sample Route


  
app.get('/', (req, res) => {
  res.send('Welc to the Express & MongoDB app!');
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per image
});

// API Route to Add Product
app.post("/api/products/add", upload.array("multiImages", 10), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      brand,
      model,
      partCode,
      capacity,
      capacityUnits,
      typeOfUnit,
      phase,
      ratedVoltage,
      stock,
      sku,
    } = req.body;

    // Parse numeric fields
    const parsedCapacity = parseFloat(capacity);
    const parsedRatedVoltage = parseFloat(ratedVoltage);
    const parsedStock = parseInt(stock, 10);

    // Validate numeric fields
    if (isNaN(parsedCapacity) || isNaN(parsedRatedVoltage) || isNaN(parsedStock)) {
      return res.status(400).json({ message: "Invalid numeric fields provided." });
    }

    // Collect image paths from uploaded files
    const imagePaths = req.files.map((file) => file.path);

    // Create new product with the updated fields
    const newProduct = new Product({
      title,
      description,
      category,
      price,
      brand,
      model,
      partCode,
      capacity: parsedCapacity,
      capacityUnits,
      typeOfUnit,
      phase,
      ratedVoltage: parsedRatedVoltage,
      stock: parsedStock,
      sku,
      images: imagePaths,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});
app.post('/api/course/add', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, youtubeLink } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    if (!title || !description || !price || !youtubeLink) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Validate YouTube URL format (basic check)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.*$/;
    if (!youtubeRegex.test(youtubeLink)) {
      return res.status(400).json({ message: 'Invalid YouTube URL.' });
    }

    const newCourse = new Course({ title, description, price, images: imagePaths, youtubeLink });
    await newCourse.save();

    res.status(201).json({ message: 'Course saved successfully!', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again.', error });
  }
});
app.get("/api/course/purchase-status", async (req, res) => {
  const { userId, courseId } = req.query;

  try {
    const purchase = await CourseOrder.findOne({ userId, courseId });

    if (purchase) {
      return res.json({ purchased: true });
    } else {
      return res.json({ purchased: false });
    }
  } catch (error) {
    console.error("Error checking purchase status:", error);
    res.status(500).json({ message: "Error checking purchase status" });
  }
});
app.get("/courses-with-buyers", async (req, res) => {
  try {
    const coursesWithBuyers = await CourseOrder.find().populate("userId").populate("courseId");
    res.json(coursesWithBuyers);
  } catch (error) {
    console.error("Error fetching course orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get('/user-purchases/:userId', async (req, res) => {
  const userId = req.params.userId;
  const purchases = await CourseOrder.find({ userId }).select("courseId");
  res.json({ purchasedCourses: purchases.map(order => order.courseId) });
});
app.get('/course-videos/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({ videos: course.videos }); // Assuming `videos` is an array in your DB
});
app.put('/api/course/update/:id', upload.array('multiImages', 5), async (req, res) => {
  const { title, description, price, video } = req.body;
  const images = req.files.map((file) => file.path); // Save image paths

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = title;
    course.description = description;
    course.price = price;
    course.video = video;
    course.images = images.length > 0 ? images : course.images; // If new images are uploaded, update

    await course.save();
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error while updating course', error });
  }
});
app.get('/api/items', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();
    
    // If no products are found, return a 404 status
    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Return the products
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/products', async (req, res) => {
  try {
    // Fetch only 3 products from the database
    const products = await Product.find().limit(3).lean();

    // If no products are found, return a 404 status
    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Return the products
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/orders', async (req, res) => {
  try {
    // Fetch all products from the database
    const orders = await Order.find();
    
    // If no products are found, return a 404 status
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Return the products
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/total-orders', async (req, res) => {
  try {
    // Fetch all users with their orders
    const users = await Order.find()  // Ensure orders are populated

    let totalOrders = 0;
    let totalAmount = 0;

    // Loop through each user and their orders
    users.forEach(user => {
      user.orders.forEach(order => {
        totalOrders += 1; // Increment order count
        totalAmount += order.totalAmount; // Add to totalAmount
      });
    });

    // Return the total order count and total amount
    res.json({ totalOrders, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/cart', async (req, res) => {
  try {
    // Fetch all products from the database
    const cart = await Cart.find();
    
    // If no products are found, return a 404 status
    if (!cart.length) {
      return res.status(404).json({ message: 'No cart found' });
    }

    // Return the products
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/api/cart/add', async(req,res)=>{
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: 'UserId, ProductId, and Quantity are required' });
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user already has a cart
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      // If the cart exists, check if the product is already in the cart
      const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
      
      if (existingProductIndex !== -1) {
        // If the product is already in the cart, update the quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.products.push({ productId, quantity });
      }
    }

    // Save the updated cart
    await cart.save();
    
    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});
app.post('/api/wishlist/add', async(req,res)=>{
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: 'UserId, ProductId, and Quantity are required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlistitem = await Wishlist.findOne({ userId });
    
    if (!wishlistitem) {
      wishlistitem = new Wishlist({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const existingProductIndex = wishlistitem.products.findIndex(item => item.productId.toString() === productId);
      
      if (existingProductIndex !== -1) {
        wishlistitem.products[existingProductIndex].quantity += quantity;
      } else {
        wishlistitem.products.push({ productId, quantity });
      }
    }

    // Save the updated cart
    await wishlistitem.save();
    
    res.status(200).json({ message: 'Product added to wishlistitem successfully', wishlistitem });
  } catch (error) {
    console.error('Error adding to wishlistitem:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});
app.delete('/api/cart/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the product to remove
    const productIndex = cart.products.findIndex(product => product._id.toString() === productId);

    if (productIndex === 1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Error removing product from cart' });
  }
});
app.delete('/api/wishlist/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  
  try {
    // Find the user's cart
    const wishlistitem = await Wishlist.findOne({ userId });

    if (!wishlistitem) {
      return res.status(404).json({ message: 'wishlistitem not found' });
    }

    // Find the index of the product to remove
    const productIndex = wishlistitem.products.findIndex(product => product._id.toString() === productId);

    if (productIndex === 1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the cart
    wishlistitem.products.splice(productIndex, 1);

    // Save the updated cart
    await wishlistitem.save();

    res.status(200).json({ message: 'Product removed from cart', wishlistitem });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Error removing product from cart' });
  }
});
app.put('/api/cart/update/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Failed to update cart', error });
  }
});
app.delete('/api/cart/clear/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

  
    cart.products = [];
    cart.totalProducts = 0; // Reset total products count
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear the cart', error });
  }
});
app.get('/api/product/:productId', async (req, res) => {
  const { productId } = req.params; // Destructure productId from req.params

  // Validate if the productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    // Fetch the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the product details
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Corrected the variable name to match ':userId' in the route

    // Assuming Cart is a model that holds the user's cart information
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ cart: { products: cart.products || [] } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Corrected the variable name to match ':userId' in the route

    // Assuming Cart is a model that holds the user's cart information
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ wishlist: { products: wishlist.products || [] } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post("/api/create-account", async (req, res) => {
  const { fname, lname, email, mobile, password, role } = req.body;

  // Validate input
  if (!fname || !lname || !email || !mobile || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate role
  const validRoles = ["student", "customer"];
  if (!validRoles.includes(role.toLowerCase())) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  try {
    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if the mobile number already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ message: "Mobile number already in use" });
    }

    // Generate unique user ID
    const userId = uuidv4();

    // Hash the password
    const saltRounds = 10; // Higher rounds increase security but slow down hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = new User({
      userId,
      fname,
      lname,
      email,
      mobile, // Store mobile number
      password: hashedPassword, // Store hashed password
      role: role.toLowerCase(), // Store role in lowercase for consistency
    });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully", userId });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id },"BANNU9", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});
app.post("/api/admin/create-account", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  // Validate input
  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate unique user ID
    const userId = uuidv4();

    // Hash the password
    const saltRounds = 10; // Higher rounds increase security but slow down hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = new User({
      userId,
      fname,
      lname,
      email,
      password: hashedPassword, // Store the hashed password
    });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully", userId });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id },"BANNU", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});
app.post('/api/addresses', async (req, res) => {
  try {
    const { userId, title, address, phoneNumber, country, state, city, pincode } = req.body;

    // Find the user by userId (you can change this logic based on your actual User model)
    const userAddress = await Address.findOne({ userId });

    if (!userAddress) {
      // If no user address document exists, create one and add the new address to it
      const newAddress = new Address({
        userId,
        details: [
          {
            title,
            address,
            phoneNumber,
            country,
            state,
            city,
            pincode,
          },
        ],
      });

      await newAddress.save();
      return res.status(200).json({ message: 'Address added successfully!', address: newAddress });
    }

    // If the user address document already exists, push the new address into the details array
    userAddress.details.push({
      title,
      address,
      phoneNumber,
      country,
      state,
      city,
      pincode,
    });

    await userAddress.save();

    res.status(200).json({ message: 'Address added successfully!', address: userAddress.details[userAddress.details.length - 1] });
  } catch (error) {
    res.status(500).json({ message: 'Error saving address', error });
  }
});
app.get('/api/addresses/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Corrected the variable name to match ':userId' in the route

    // Assuming Cart is a model that holds the user's cart information
    const Addressnew = await Address.findOne({ userId });

    if (!Addressnew) {
      return res.status(404).json({ message: 'Address new not found' });
    }
    res.status(200).json(Addressnew);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.put("/api/addresses/:userId/:addressId", async (req, res) => {
  const { addressId } = req.params; // Destructuring both params
  const userId = req.params.userId; // Corrected the variable name to match ':userId' in the route
  const updatedDetails = req.body; // The updated address details from the request body

  try {
    // Find the user by userId and the specific address in the "details" array by addressId
    const result = await Address.findOneAndUpdate(
      { userId, "details._id": addressId },
      { $set: { "details.$": updatedDetails } }, // Use MongoDB positional operator to update the matched element
      { new: true, runValidators: true } // Return the updated document and validate the input
    );

    if (!result) {
      return res.status(404).json({ message: "Address or user not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      updatedAddress: result.details.id(addressId), // Fetch the updated address directly from the array
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      message: "An error occurred while updating the address",
      error: error.message,
    });
  }
});
app.get('/api/addresses/:userId/:addressId', async (req, res) => {
  const { addressId } = req.params; // Extract userId and addressId from params
  const userId = req.params.userId; // Corrected the variable name to match ':userId' in the route

  try {
    const user = await Address.findOne({ userId, "details._id": addressId }); // Find user and address

    if (!user) {
      return res.status(404).json({ message: "User or address not found" });
    }

    const address = user.details.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Return the found address details
    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({
      message: "An error occurred while fetching the address",
      error: error.message,
    });
  }
});
app.get("/api/addresses", async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.delete("/api/addresses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Delete request for ID:", id);

    const address = await Address.findById(id);

    if (!address) {
      console.log("Address not found for ID:", id);
      return res.status(404).json({ message: "Address not found" });
    }

    // Delete the address
    await Address.findByIdAndDelete(id);

    console.log("Address deleted successfully:", address);
    res.status(200).json({ message: "Address deleted successfully", address });
  } catch (err) {
    console.error("Error deleting address:", err.message);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid address ID format" });
    }
    console.log("Delete request for ID:", id);

    res.status(500).json({ message: "An error occurred while deleting the address" });
  }
});
app.delete("/api/addresses/:userId/:addressId", async (req, res) => {
  const { addressId } = req.params;
  const userId = req.params.userId; // Corrected the variable name to match ':userId' in the route

  try {
    // Find the document by userId and update the details array
    const result = await Address.findOneAndUpdate(
      { userId },
      { $pull: { details: { _id: addressId } } }, // Pull the specific address by its ID
      { new: true } // Return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: "Address document not found" });
    }

    const updatedDetails = result.details.find(detail => detail._id.toString() === addressId);
    if (!updatedDetails) {
      return res.status(404).json({ message: "Specific address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully", updatedDetails });
  } catch (err) {
    console.error("Error deleting address:", err.message);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    res.status(500).json({ message: "An error occurred while deleting the address" });
  }
});
app.post('/api/orders/placeOrder', async (req, res) => {
  try {
    const {
      userId,
      addressId,
      paymentOption,
      address,
      title,
      phoneNumber,
      state,
      country,
      pincode,
      city,
      product,
      cartTotal,
      shippingCost,
      taxAmount,
      totalAmount,
      pointsBalance,
      walletBalance,
      razorpayOrderId,
      razorpayPaymentId,
    } = req.body;

    // Validate required fields
    if (!userId || !addressId || !product || product.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Please provide all required fields.',
      });
    }

    let userOrder = await Order.findOne({ userId });

    if (!userOrder) {
      userOrder = new Order({
        userId,
        orders: [],
      });
    }

    // Create a new order object
    const newOrder = {
      addressId,
      address,
      title,
      phoneNumber,
      state,
      country,
      pincode,
      city,
      paymentOption,
      product,
      cartTotal,
      shippingCost,
      taxAmount,
      totalAmount,
      pointsBalance,
      walletBalance,
      status: 'Pending',
      razorpayOrderId,
      razorpayPaymentId,
      createdAt: new Date(),
    };

    // Check stock and update the product stock
    for (let i = 0; i < product.length; i++) {
      const productItem = product[i]; // The current product
      const { productId, quantity } = productItem;

      // Find the product in the Product model by its ID
      const productInDb = await Product.findById(productId);

      if (!productInDb) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Check if there's enough stock
      if (productInDb.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${productInDb.title}`,
        });
      }

      // Decrement the stock for this product
      productInDb.stock -= quantity;

      // Save the updated product in the database
      await productInDb.save();
    }

    // Add the new order to the user's orders array
    userOrder.orders.push(newOrder);

    // Save the updated order document
    const savedOrder = await userOrder.save();

    // Send an email notification (e.g., order confirmation)
    sendOrderEmail(userId, newOrder);

    // Send the response back to the client
    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: savedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to place order!',
      error: err.message,
    });
  }
});
async function sendOrderEmail(userId, order) {
  try {
    // Fetch user email
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.warn(`User with ID ${userId} not found or missing email.`);
      return;
    }

    // Email content for the admin
    const adminMailOptions = {
      from: 'circuitcare.electronics@gmail.com',
      to: 'circuitcare.electronics@gmail.com',
      subject: 'New Order Received',
      html: `
        <h1>New Order Received</h1>
        <p>You have received a new order.</p>
       
      `,
    };

    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log(`New order alert email sent to admin`);

  } catch (error) {
    console.error('Error sending order confirmation email:', error.message);
  }
}

app.get('/api/orders/recent', async (req, res) => {
  try {
    const recentOrder = await Order.findOne({ order: [['createdAt', 'DESC']] }); // Example query
    if (recentOrder) {
      res.json(recentOrder);
    } else {
      res.status(404).json({ message: 'No orders found.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent order.', error: err.message });
  }
});
const razorpay = new Razorpay({
  key_id: process.env.Razorpay_keyid,
  key_secret: process.env.Razorpay_keysecret,
});
app.post("/api/orders/createRazorpayOrder", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || amount <= 0 || !currency) {
      return res.status(400).json({ message: "Invalid amount or currency" });
    }

    const options = {
      amount: amount * 100, 
      currency,
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});
app.post("/api/orders/verifyPayment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});
app.get('/api/orders/:userId', async (req, res) => {
  try {
      const { userId } = req.params;

      // Fetch orders for the user
      const orders = await Order.find({ userId });

      if (!orders || orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this user' });
      }

      // Calculate total orders (all individual order items across orders)
      const totalOrders = orders.reduce((total, order) => {
        return total + (order.orders ? order.orders.length : 0); // Count all individual orders within each order
      }, 0);

      // Calculate total amount (sum of all totalAmount across individual orders)
      const totalAmount = orders.reduce((acc, order) => {
        return acc + order.orders.reduce((orderAcc, orderDetail) => {
          return orderAcc + (orderDetail.totalAmount || 0);  // Use 0 if totalAmount is undefined or null
        }, 0);
      }, 0);

      res.status(200).json({ orders, totalOrders, totalAmount });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create a new contact document
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Save to the database
    await newContact.save();

    // Email content
    const mailOptions = {
      from: 'circuitcare.electronics@gmail.com' , // Sender address
      to: 'circuitcare.electronics@gmail.com',  // Admin email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Contact form email sent successfully!');
    console.log(`${name}`);

    res.status(201).json({ message: "Contact details saved and email sent successfully!" });
  } catch (error) {
    console.error("Error saving contact details or sending email:", error);
    res.status(500).json({ error: "An error occurred while processing the contact details." });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find(); // or `Course.findAll()` for Sequelize
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/courses/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId); // Find product by primary key

    if (!course) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(course); // Return the product details
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.delete("/api/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Delete request for ID:", id);

    const address = await Product.findById(id);

    if (!address) {
      console.log("product not found for ID:", id);
      return res.status(404).json({ message: "product not found" });
    }

    // Delete the address
    await Product.findByIdAndDelete(id);

    console.log("product deleted successfully:", address);
    res.status(200).json({ message: "Address deleted successfully", address });
  } catch (err) {
    console.error("Error deleting address:", err.message);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid address ID format" });
    }
    console.log("Delete request for ID:", id);

    res.status(500).json({ message: "An error occurred while deleting the address" });
  }
});
app.put('/api/products/update/:id', upload.array('multiImages'), async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    category, 
    price, 
    brand, 
    model, 
    partCode, 
    capacity, 
    capacityUnits, 
    typeOfUnit, 
    phase, 
    stock, 
    ratedVoltage 
  } = req.body;
  const images = req.files; // Get uploaded images from the request

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.brand = brand || product.brand;
    product.model = model || product.model;
    product.partCode = partCode || product.partCode;
    product.capacity = capacity || product.capacity;
    product.capacityUnits = capacityUnits || product.capacityUnits;
    product.typeOfUnit = typeOfUnit || product.typeOfUnit;
    product.phase = phase || product.phase;
    product.stock = stock || product.stock;
    product.ratedVoltage = ratedVoltage || product.ratedVoltage;

    // If images are uploaded, update them
    if (images && images.length > 0) {
      // Assuming you store images in the product object (update based on your model)
      product.images = images.map(file => file.path); // Store file paths (or URLs)
    }

    // Save the updated product
    await product.save();

    // Return the updated product details
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.put('/api/course/update/:id', upload.array('multiImages'), async (req, res) => {
  const { id } = req.params;
  const { title, description, category, price } = req.body;
  const images = req.files; // Get uploaded images from the request

  try {
    // Find the product by ID
    const product = await Course.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;

    // If images are uploaded, update them
    if (images && images.length > 0) {
      // Assuming you store images in the product object (update based on your model)
      product.images = images.map(file => file.path); // Store file paths (or URLs)
    }

    // Save the updated product
    await product.save();

    // Return the updated product details
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/users', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await User.find();
    
    // If no products are found, return a 404 status
    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Return the products
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get("/api/users/:userId/orders", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user's order document by userId
    const userOrders = await Order.findOne({ userId });

    if (!userOrders) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Extract the orders array
    const ordersArray = userOrders.orders;

    // Calculate the total number of orders
    const ordersCount = ordersArray.length;

    // Calculate the total amount spent across all orders
    const totalSpent = ordersArray.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Respond with the calculated values
    res.json({ ordersCount, totalSpent });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});
app.get('/api/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Fetch the order and populate user, address, and product details
    const order = await Order.findById(orderId)
      .populate('userId', 'fname lname email phone') // Populate user details
      .populate('orders', 'street city state zipCode country') // Populate address details
      .populate('orders.product', 'title price description category images'); // Populate product details

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Format the response with detailed data
    const formattedOrder = {
      _id: order._id,
      user: order.userId, // Populated user details
      orders: order.orders.map(order => ({
        address: order.addressId, // Populated address details
        deliveryOption: order.deliveryOption,
        paymentOption: order.paymentOption,
        products: order.product.map(item => ({
          productId: item.productId, // Product ID
          title: item.productId.title,
          description: item.productId.description,
          category: item.productId.category,
          price: item.productId.price,
          images: item.productId.images,
          quantity: item.quantity, // Quantity of the product in the order
        })),
        cartTotal: order.cartTotal,
        shippingCost: order.shippingCost,
        taxAmount: order.taxAmount,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      })),
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/data', async (req, res) => {

  try {
    
    const orders = await Order.find()
      .populate('userId', 'fname lname email phone') // Populate user details
      .populate('orders', 'street city state zipCode country') // Populate address details
      .populate('orders.product', 'title price description category images'); // Populate product details

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json(orders); // Send all orders for the user
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const product = await User.findById(userId); // Find product by primary key

    if (!product) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.json(product); // Return the product details
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/admin/orders', async (req, res) => {
  try {
    // Fetch all orders with populated user, address, and product details
    const orders = await Order.find()
      .populate('userId', 'fname email') // Populate user details
      .populate({
        path: 'orders',
        select: 'address state country pincode city paymentOption product cartTotal shippingCost taxAmount totalAmount pointsBalance walletBalance status razorpayOrderId razorpayPaymentId createdAt phoneNumber',
      })
      .populate({
        path: 'orders.product.productId', // Populate product details
        model: 'Product',
        select: 'title price description category',
      })
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found!',
      });
    }

    // Map through orders to structure the response
    const formattedOrders = orders.map(order => ({
      orderId: order._id || 'NA',
      user: {
        id: order.userId?._id || 'NA',
        name: order.userId?.fname || 'N/A',
        email: order.userId?.email || 'N/A',
      },
      orderDetails: order.orders.map(orderDetail => ({
        orderDetailId: orderDetail._id,
        addressid: orderDetail.addressId || 'Address not available',
        address: orderDetail.address || 'N/A',
        title: orderDetail.title || 'N/A', // Ensure proper name reference
        Number: orderDetail.phoneNumber || 'N/A',
        state: orderDetail.state || 'N/A',
        country: orderDetail.country || 'N/A',
        pincode: orderDetail.pincode || 'N/A',
        city: orderDetail.city || 'N/A',
        paymentOption: orderDetail.paymentOption || 'N/A',
        products: orderDetail.product.map(productDetail => ({
          id: productDetail.productId?._id || 'N/A',
          title: productDetail.productId?.title || 'N/A',
          description: productDetail.productId?.description || 'N/A',
          category: productDetail.productId?.category || 'N/A',
          price: productDetail.productId?.price || 'N/A',
          quantity: productDetail.quantity || 0,
        })),
        cartTotal: orderDetail.cartTotal || 0,
        shippingCost: orderDetail.shippingCost || 0,
        taxAmount: orderDetail.taxAmount || 0,
        totalAmount: orderDetail.totalAmount || 0,
        pointsBalance: orderDetail.pointsBalance || 0,
        walletBalance: orderDetail.walletBalance || 0,
        status: orderDetail.status || 'Pending',
        razorpayOrderId: orderDetail.razorpayOrderId || 'N/A',
        razorpayPaymentId: orderDetail.razorpayPaymentId || 'N/A',
        createdAt: orderDetail.createdAt,
      })),
    }));

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully!',
      orders: formattedOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders!',
      error: err.message,
    });
  }
});


app.get("/api/filter", async (req, res) => {
  try {
    const categories = req.query.categories ? req.query.categories.split(",") : [];
    const query = categories.length > 0 ? { category: { $in: categories } } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});
app.get('/errorCode', async (req, res) => {
  try {
    const errorCodes = await ErrorCode.find();
    res.json(errorCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/errorcode', async (req, res) => {
  const { company, errorCode, description } = req.body;

  const newErrorCode = new ErrorCode({
    company,
    errorCode,
    description,
  });

  try {
    const savedErrorCode = await newErrorCode.save();
    res.status(201).json(savedErrorCode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.put('/api/admin/orders/:orderDetailId/status', async (req, res) => {
  const { orderDetailId } = req.params;
  const { status } = req.body;

  try {
    // Update the status in the database
    const order = await Order.findOneAndUpdate(
      { 'orders._id': orderDetailId }, // Match the orderDetailId
      { $set: { 'orders.$.status': status } }, // Update the specific status
      { new: true }
    ).populate('userId', 'fname email'); // Populate user details

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found!' });
    }

    // Extract user information for email
    const user = order.userId;
    const userEmail = user.email;
    const userName = user.fname;

    // Send email to the user
    const mailOptions = {
      from: 'circuitcare.electronics@gmail.com',
      to: userEmail,
      subject: 'Order Status Update',
      text: `Hi ${userName},\n\nYour order status has been updated to "${status}".\n\nThank you for shopping with us!\n\nBest regards,\nYour Company Name`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
          success: false,
          message: 'Status updated but failed to send email!',
          error: error.message,
        });
      }

      console.log('Email sent:', info.response);
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated and email sent to the user!',
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status!',
      error: error.message,
    });
  }
});
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    const order = await razorpay.orders.create({ amount, currency, receipt });
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
});

// **Save Course Purchase Data**
app.post("/api/course/data", async (req, res) => {
  try {
    const { courseId, userId, paymentId } = req.body;
    const newOrder = new CourseOrder({
      courseId,
      userId,
      paymentId,
      date: new Date(),
    });
    await newOrder.save();
    res.json({ message: "Order saved successfully!" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});
app.put("/courses/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

// Delete a course
app.delete("/courses/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

app.get("/api/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await CourseOrder.find({ userId });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email provider
  auth: {
    user: process.env.email, // Your email address
    pass: process.env.app_pass, // Your email password or app-specific password
  },
});
app.delete('/api/errorcode/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ErrorCode.findByIdAndDelete(id);
    res.json({ message: "Error code deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting error code", error });
  }
});
app.get("/", async (req, res) => {
 console.log("server is running")
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});