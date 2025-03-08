const express = require('express');
const path = require('path');
const JSONdb = require('simple-json-db');
const nodemailer = require('nodemailer');
const app = express();
const db = new JSONdb('./data.json');

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define your routes here
app.get('/', (req, res) => {
  const items = db.get('items') || [];
  res.render('index', { items: items });
});

// Contact form submission
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ges.service.no.reply@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'qzki gyhi wgjz czni' // Use environment variable in production
      }
    });
    
    // Email content
    const mailOptions = {
      from: 'ges.service.no.reply@gmail.com',
      to: 'ges.service.no.reply@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background: linear-gradient(135deg, #56299A 0%, #7B42C3 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .email-logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .email-title {
              font-size: 22px;
              margin: 0;
              font-weight: normal;
            }
            .email-body {
              padding: 30px;
            }
            .email-section {
              margin-bottom: 25px;
            }
            .email-label {
              font-weight: bold;
              color: #56299A;
              margin-bottom: 5px;
              display: block;
            }
            .email-value {
              background-color: #f5f5f5;
              padding: 12px 15px;
              border-radius: 6px;
              border-left: 3px solid #7B42C3;
            }
            .email-message {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 6px;
              border-left: 3px solid #7B42C3;
              white-space: pre-line;
            }
            .email-footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              color: #666666;
              font-size: 14px;
              border-top: 1px solid #eeeeee;
            }
            .highlight {
              color: #56299A;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <div class="email-logo"><i class="fas fa-leaf"></i> GES</div>
              <h1 class="email-title">New Contact Form Submission</h1>
            </div>
            
            <div class="email-body">
              <p>A new message has been submitted through the Gonzaga Environmental Services website contact form.</p>
              
              <div class="email-section">
                <span class="email-label">Name:</span>
                <div class="email-value">${name}</div>
              </div>
              
              <div class="email-section">
                <span class="email-label">Email Address:</span>
                <div class="email-value">${email}</div>
              </div>
              
              <div class="email-section">
                <span class="email-label">Subject:</span>
                <div class="email-value">${subject}</div>
              </div>
              
              <div class="email-section">
                <span class="email-label">Message:</span>
                <div class="email-message">${message}</div>
              </div>
              
              <p>Please respond to this inquiry within 24-48 hours.</p>
            </div>
            
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} Gonzaga Environmental Services. All rights reserved.</p>
              <p>19 I St NW, Washington, DC 20001 | (202) 336-7100</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

// Start the server
const PORT = 1654;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create operation
app.post('/item', (req, res) => {
    const items = db.get('items') || [];
    items.push({
      name: req.body.name,
      description: req.body.description
    });
    db.set('items', items);
    res.redirect('/');
  });
  
  // Read operation (already implemented in the main route)
  
  // Update operation - form
  app.get('/item/:id/edit', (req, res) => {
    const items = db.get('items') || [];
    const item = items[req.params.id];
    res.render('edit', { item: item, id: req.params.id });
  });
  
  // Update operation - process
  app.post('/item/:id/update', (req, res) => {
    const items = db.get('items') || [];
    items[req.params.id] = {
      name: req.body.name,
      description: req.body.description
    };
    db.set('items', items);
    res.redirect('/');
  });
  
  // Delete operation
  app.post('/item/:id/delete', (req, res) => {
    const items = db.get('items') || [];
    items.splice(req.params.id, 1);
    db.set('items', items);
    res.redirect('/');
  });