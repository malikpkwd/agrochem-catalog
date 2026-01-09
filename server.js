const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Path to products.json
const productsFilePath = path.join(__dirname, 'src/data/products.json');

// Path to addresses.json
const addressesFilePath = path.join(__dirname, 'src/data/addresses.json');

// Helper function to read products from file
const readProducts = () => {
  try {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error('Error reading products:', err);
    return [];
  }
};

// Helper function to write products to file
const writeProducts = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing products:', err);
  }
};

// Helper function to read addresses from file
const readAddresses = () => {
  try {
    if (fs.existsSync(addressesFilePath)) {
      const data = fs.readFileSync(addressesFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error('Error reading addresses:', err);
    return [];
  }
};

// Helper function to write addresses to file
const writeAddresses = (addresses) => {
  try {
    fs.writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing addresses:', err);
  }
};

// Email transporter configuration (using Gmail with app password)
// For production, use environment variables: process.env.EMAIL_USER, process.env.EMAIL_PASS
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'malikpk.wd@gmail.com',
    pass: process.env.EMAIL_PASS || 'mmnv tgnu rwpi prvu'
  }
});

// Helper function to send email
const sendOrderEmail = async (orderData) => {
  try {
    const { email, fullName, cartItems, total } = orderData;
    
    const itemsHtml = cartItems.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Order Confirmation</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for your order! We're excited to get your products to you.</p>
        
        <h3 style="color: #333; margin-top: 20px;">Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <h3 style="text-align: right; color: #28a745; margin-top: 15px;">Total: $${total.toFixed(2)}</h3>
        
        <h3 style="color: #333; margin-top: 20px;">Shipping Address:</h3>
        <p style="margin: 5px 0;">
          ${orderData.address}<br>
          ${orderData.city}, ${orderData.state} ${orderData.pincode}<br>
          ${orderData.country}
        </p>
        
        <p style="color: #666; margin-top: 20px; font-size: 12px;">
          Order ID: ${orderData.id} | Order Date: ${new Date(orderData.orderDate).toLocaleDateString()}
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          If you have any questions, please reply to this email or visit our support page.
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'malikpk.wd@gmail.com',
      to: email,
      subject: `Order Confirmation - Pesticide Catalog (Order #${orderData.id})`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${email}`);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};

// GET all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// POST create new product
app.post('/api/products', (req, res) => {
  const products = readProducts();
  const newProduct = req.body;
  
  // Validate required fields
  if (!newProduct.name || !newProduct.price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  // Generate new ID (max ID + 1)
  const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
  newProduct.id = maxId + 1;
  
  // Add default fields if missing
  if (!newProduct.description) newProduct.description = '';
  if (!newProduct.image) newProduct.image = 'https://via.placeholder.com/150';
  
  products.push(newProduct);
  writeProducts(products);
  
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Update product (keep ID, allow updates to other fields)
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    id: parseInt(req.params.id) // Ensure ID doesn't change
  };
  
  products[productIndex] = updatedProduct;
  writeProducts(products);
  
  res.json(updatedProduct);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  writeProducts(products);
  
  res.json({ message: 'Product deleted', product: deletedProduct });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running on port ' + PORT });
});

// ============ ADDRESSES ENDPOINTS ============

// GET all addresses
app.get('/api/addresses', (req, res) => {
  const addresses = readAddresses();
  res.json(addresses);
});

// GET single address by ID
app.get('/api/addresses/:id', (req, res) => {
  const addresses = readAddresses();
  const address = addresses.find(a => a.id === parseInt(req.params.id));
  
  if (!address) {
    return res.status(404).json({ error: 'Address not found' });
  }
  
  res.json(address);
});

// POST new address
app.post('/api/addresses', (req, res) => {
  const addresses = readAddresses();
  
  const newAddress = {
    id: addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  addresses.push(newAddress);
  writeAddresses(addresses);
  
  res.status(201).json(newAddress);
});

// PUT update address
app.put('/api/addresses/:id', (req, res) => {
  const addresses = readAddresses();
  const addressIndex = addresses.findIndex(a => a.id === parseInt(req.params.id));
  
  if (addressIndex === -1) {
    return res.status(404).json({ error: 'Address not found' });
  }
  
  const updatedAddress = {
    ...addresses[addressIndex],
    ...req.body,
    id: parseInt(req.params.id),
    updatedAt: new Date().toISOString()
  };
  
  addresses[addressIndex] = updatedAddress;
  writeAddresses(addresses);
  
  res.json(updatedAddress);
});

// DELETE address
app.delete('/api/addresses/:id', (req, res) => {
  const addresses = readAddresses();
  const addressIndex = addresses.findIndex(a => a.id === parseInt(req.params.id));
  
  if (addressIndex === -1) {
    return res.status(404).json({ error: 'Address not found' });
  }
  
  const deletedAddress = addresses[addressIndex];
  addresses.splice(addressIndex, 1);
  writeAddresses(addresses);
  
  res.json({ message: 'Address deleted', address: deletedAddress });
});

// ============ EMAIL ENDPOINT ============

// POST send order confirmation email
app.post('/api/send-email', async (req, res) => {
  try {
    const orderData = req.body;
    
    if (!orderData.email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const emailSent = await sendOrderEmail(orderData);
    
    if (emailSent) {
      res.json({ success: true, message: 'Order confirmation email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (err) {
    console.error('Email endpoint error:', err);
    res.status(500).json({ error: 'Error sending email: ' + err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API endpoints:`);
  console.log(`  GET    /api/products       - Get all products`);
  console.log(`  GET    /api/products/:id   - Get product by ID`);
  console.log(`  POST   /api/products       - Create new product`);
  console.log(`  PUT    /api/products/:id   - Update product`);
  console.log(`  DELETE /api/products/:id   - Delete product`);
  console.log(`  GET    /api/addresses      - Get all addresses`);
  console.log(`  POST   /api/addresses      - Save new address (checkout)`);
  console.log(`  POST   /api/send-email     - Send order confirmation email`);
  console.log(`  GET    /health             - Health check`);
});
