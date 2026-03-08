import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";




const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();




  const handleSearchSubmit = (searchText) => {
    if (!searchText.trim()) return;




    const pathParts = location.pathname.split("/");
    const currentType = pathParts[1];




    if (currentType === "rent" || currentType === "sale") {
      navigate(`/${currentType}/laptop?q=${searchText}`);
    } else {
      navigate(`/rent/laptop?q=${searchText}`);
    }
  };




  return (
    <>
      <Navbar onSearchSubmit={handleSearchSubmit} />
      <main>{children}</main>
    </>
  );
};




export default Layout;
