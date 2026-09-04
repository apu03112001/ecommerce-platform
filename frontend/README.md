# LabuShop - MERN E-Commerce Platform

LabuShop is a full-stack e-commerce web application built using the MERN stack.

It includes user authentication, product management, shopping cart, wishlist, order processing, Razorpay test payments, Cloudinary image uploads, and an admin dashboard.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer

### External Services

- MongoDB Atlas
- Cloudinary
- Razorpay

---

## Main Features

### User Features

- User registration
- User login
- JWT authentication
- Product browsing
- Product search
- Category filtering
- Product details page
- Add to cart
- Remove from cart
- Wishlist
- Checkout
- Razorpay test payment
- Order creation

### Admin Features

- Admin authentication
- Create products
- Upload product images
- Cloudinary image storage
- View products
- Edit products
- Delete products
- Product stock management

---

## Project Architecture

```text
React Frontend
      |
      | Axios / REST API
      |
Express Backend
      |
      |---- JWT Authentication
      |
      |---- Product APIs
      |
      |---- Cart APIs
      |
      |---- Wishlist APIs
      |
      |---- Order APIs
      |
      |---- Razorpay
      |
      |---- Cloudinary
      |
MongoDB Atlas