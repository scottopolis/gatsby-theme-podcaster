import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';
// import "../css/tailwind-customizations.css"
// import "../css/index.scss"

const Layout = ({ children }) => (
    <>
    <Header />
    <div className="site-content max-w-4xl m-auto sm:p-4 bg-black text-white pb-20">{children}</div>
    <Footer />
    </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
