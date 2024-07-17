# Nova Nosh

Welcome to **Nova Nosh** - your ultimate destination for innovative and delightful culinary experiences! Our platform allows users to order food, book tables, and track their orders in real-time, all with the convenience of online payment. Dive into the features and start enjoying a seamless dining experience!

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

1. **User Authentication**: Secure login and signup with email verification.
2. **Password Recovery**: Easily reset forgotten passwords.
3. **Responsive Design**: Enjoy a seamless experience across all devices.
4. **Real-Time Menu Management**: Instantly update and view menu items.
5. **Order Management**: Place food orders and receive real-time updates.
6. **Table Booking**: Book tables and receive real-time status updates.
7. **Online Payment**: Secure payments via Razorpay, ensuring a smooth transaction process.
8. **Profile Management**: Update personal information and addresses with ease.
9. **Whistlist**: Save your favorite items for quick access.
10. **Contact Support**: Reach out to our support team for assistance.

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
    ```bash
   https://github.com/impriyanshu29/nova_nosh.git
    cd nova-nosh
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the following variables:

### For API Server

```env
MONGODB_URL=mongodb://localhost:27017/nova_nosh
PORT=7000
CORS_ORIGIN=*
MAIL_USER="apikey"
MAIL_PASS="apipass"
DOMAIN=http://localhost:5173
SENDER_EMAIL='abc@email.com'
COMPANY_NAME=Nova Nosh
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET_EXPIRE=18d
ACCESS_TOKEN_SECRET_EXPIRE=1d
RAZORPAY_KEY_ID=rzp_test_1X2X3X4X5X6X7X8X9X0X
RAZORPAY_KEY_SECRET=1X2X3X4X5X6X7X8X9X0X
SENDGRID_API_KEY="apikey"
HELP_URL=https://yourdomain.com/help
PRIVACY_POLICY_URL=https://yourdomain.com/privacy-policy

```
### For Client

```env for client
VITE_FIREBASE_API_KEY="AIzaSyD1-1X2X3X4X5X6X7X8X9X0X"
VITE_FIREBASE_APP_ID ="1:web:1X2X3X4X5X6X7X8X9X0X"
VITE_FIREBASE_MESSAGING_SENDER_ID="1x2x3x4x5x6x7x8x9x0x" "
VITE_RAZORPAY_KEY_ID =rzp_test_1X2X3X4X5X6X7X8X9X0X
```

4. **Start the development server:**
    ```bash
    for api server
    npm run dev
    ```
    ```bash
    for client
    npm run dev
    ```


5. **Navigate to:**
    ```url
    http://localhost:5173
    ```

## Usage

Once the application is set up, you can:

- **Sign Up/Login**: Create an account or log in with your existing credentials.
- **Verify Email**: Verify your email to access all features.
- **Browse Menu**: Explore the exciting and innovative menu items.
- **Order Food**: Place an order and track its status in real-time.
- **Book Tables**: Reserve a table and receive instant confirmation.
- **Edit Profile**: Update your personal information and addresses.
- **Online Payment**: Pay for your orders securely through Razorpay.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Email Services**: SendGrid
- **Payments**: Razorpay API
- **Deployment**: Render
- **Version Control**: Git, GitHub
- **Editor**: Visual Studio Code
- **Design**: Figma


## Contributing

We welcome contributions to enhance Nova Nosh! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

Please make sure your code adheres to the project's coding standards and includes tests.



## Contact

For any inquiries or support, please contact us at:

- **Email**: novanosh29@gmail.com
- **Website**: [Nova Nosh](https://nova-nosh.onrender.com/)
- **GitHub**: [Nova Nosh](https://github.com/impriyanshu29/nova_nosh)


