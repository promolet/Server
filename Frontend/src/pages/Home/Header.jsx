import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Product from './Products';
import Slider from '../Product/slider';
import Navbar from './Navbar';
import Top from './Top'
const Header = () => {
  return (
    <>
    <Slider/>
    <Product/> 
    </>
  );
};

export default Header;
