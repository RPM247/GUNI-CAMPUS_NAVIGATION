# GUNI - CAMPUS NAVIGATION

## Description:
GUNI Campus Navigation is a full-stack web application designed to help students, staff, and visitors navigate the Ganpat University campus with ease. The system includes real-time location tracking, optimized route guidance, place details, and an admin interface for managing campus data. It supports secure user authentication via email-based OTP verification and JWT session management.


## Screenshots: 
Landing Page:
![image](https://github.com/user-attachments/assets/4f6d268e-49fa-4684-8579-f532e216e473)

Registration Page:
![image](https://github.com/user-attachments/assets/e9423394-8b96-4f20-9736-5dd37640a203)

Login Page:
![image](https://github.com/user-attachments/assets/8a087470-1500-44f4-9e85-6b423de5d778)
![image](https://github.com/user-attachments/assets/bfe736f2-1205-4431-acd1-0b7444e07bf4)

Category Selection Page:
![image](https://github.com/user-attachments/assets/7df1eb71-80b8-4d62-8d18-d6770fc75541)

Places Listing Page:
![image](https://github.com/user-attachments/assets/9c19b906-2079-4ad4-8f9b-521b1de04415)

Navigation Page:
![image](https://github.com/user-attachments/assets/903057a0-149a-496c-95fd-e6a6b1fd246b)
![image](https://github.com/user-attachments/assets/bc9d6b97-4156-477f-b594-89cb66e2667a)

Admin dashboard:
![image](https://github.com/user-attachments/assets/89e11354-1f8f-4260-9bf7-0df17a5720f3)

Admin functionality to add Places:
![image](https://github.com/user-attachments/assets/5194aee1-a660-466a-bcd0-f7acf918b8e3)


## Installation and run instructions:
Prerequisites:    
Node.js (v16+ recommended)  
MongoDB Atlas account  
Mapbox GL JS Access Token  
Cloudinary Preset token  
Email service credentials (e.g., Gmail SMTP) for OTP delivery  

Setup Instructions:
1) Clone the repository:  
   git clone https://github.com/RPM247/GUNI-CAMPUS_NAVIGATION.git  
   cd GUNI-CAMPUS_NAVIGATION
   
2) Environment Configuration:  
   Create .env files in both client/ and server/ folders having variables:  
   For server/.env:  
   FRONTEND_URL = [your frontend url]  
   MONGODB_URI =  [mongoDB uri of your database]  
   JWT_SECRET_KEY = [your secret key]  
   SMTP_HOST = smtp.gmail.com  
   SMTP_PORT = 587  
   SMTP_USER = [your email ID which will send otp for verification]  
   SMTP_PASS = [your email account password]  
   SMTP_SECURE = false

   For client/.env:  
   VITE_CLOUDINARY_CLOUD_NAME = [your cloudinary preset uri]  
   VITE_BACKEND_URL = [your backend url]  
   VITE_ORS_API_KEY = [access token of OpenStreet Map api (if you want to use OSM api)]  
   VITE_MAPBOX_ACCESS_TOKEN = [access token of Mapbox GL JS Map api (if you want to use Mapbox map api)]

3) Install dependencies:  
   Backend:  
   cd server  
   npm install  
   npm install -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals postcss tailwindcss vite  
   npm install @mapbox/mapbox-gl-directions @reduxjs/toolkit axios leaflet leaflet-routing-machine mapbox-gl next-images react react-dom react-geolocated react-hot-toast react-icons react-leaflet react-map-gl react-redux react-router-dom  

   Frontend:  
   cd client  
   npm install  
   npm install -D nodemon  
   npm install express mongoose cors dotenv jsonwebtoken bcryptjs nodemailer

4) Run the application:  
   Start backend server:  
   cd server  
   npm run dev  

   Start frontend server (in seperate or splitted terminal):  
   cd client  
   npm run dev


## Features:    
🔐 Authentication with OTP: Secure sign-up/login using email OTP and JWT session management.  
🗺️ Interactive Map: Displays current location, navigation routes, and nearby places using Mapbox.  
📝 Admin Panel: Add, edit, or delete campus places with coordinates, images, and descriptions.  
📢 Voice Navigation: Step-by-step voice guidance along the navigation path.  
🧭 Live Tracking: Real-time user position updates on the map.  




   
