import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./pages/Home/Header";
import ProductDetail from "./pages/Product/ProductDisplay";
import Navbar from "./pages/Home/Navbar";
import { CartProvider } from "./pages/Cart/CartContent";
import BillingPage from "./pages/Billing/Billingpage";
import Footer from "./pages/Footer/Footer";
import Shop from "./pages/Shop/Shop";
import Services from "./pages/Services/services";
import Register from "./pages/Auth/Register/Register";
import Login from "./pages/Auth/Login/Login";
import { AuthProvider } from "./pages/Auth/Authcontent/Authcontent";
import CartOffcanvas from "./pages/Cart/CartOffcanvas";
import AddAddress from "./pages/Billing/AddAddress";
import Profile from "./pages/Auth/Profile/Profile";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Courses from "./pages/Courses/Courses";
import CourseDetail from "./pages/Courses/DisplayCourse";
import AcError from "./pages/Home/AcError";
import OrderConfirmation from "./pages/Billing/OrderConformation";
import Faq from "./pages/Faq";
import About from "./pages/About";
import PrivacyPolicy from "./pages/Footer/privacy";
import TermsAndConditions from "./pages/Footer/Terms";
const Allroutes = () => {
  return (
    <AuthProvider>
    <CartProvider>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop/:title/:id" element={<ProductDetail />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/billing/:title/:id" element={<BillingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addnewaddress" element={<AddAddress/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/acerror" element={<AcError />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<About />} />
        <Route path="/Privacy" element={<PrivacyPolicy />} />
        <Route path="/Terms" element={<TermsAndConditions />} />
        <Route path="/orderConformation" element={<OrderConfirmation />} />
        
      </Routes>
      <Footer/>
    </Router>
    </CartProvider>
    </AuthProvider>
  );
};

export default Allroutes;
