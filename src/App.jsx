import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";


/* Context */
import { CartProvider } from "./context/CartContext";


/* Components */
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";


/* Pages */
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ReturnPolicy from "./pages/ReturnPolicy";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Invoice from "./pages/Invoice";
import OrderSuccess from "./pages/OrderSuccess";
import AccessRequired from "./pages/AccessRequired";


import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ContactUs from "./pages/ContactUs";


import UserDashboard from "./pages/UserDashboard";
import EditProfile from "./pages/EditProfile";
import MyOrders from "./pages/MyOrders";


import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminRentals from "./pages/AdminRentals";
import AdminUsers from "./pages/AdminUsers";
import AdminEditUser from "./pages/AdminEditUser";
import AdminReports from "./pages/AdminReports";
import ManageOrders from "./pages/ManageOrders";
import ViewAllOrders from "./pages/ViewAllOrders";


/* Services */
import RaiseService from "./pages/Service/RaiseService";
import MyServices from "./pages/Service/MyServices";
import ManageServices from "./pages/Service/ManageServices";


/* ---------------- PROTECTED ROUTE ---------------- */
const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");


  if (!userRole) {
    return <Navigate to="/login/user" replace />;
  }


  if (role && userRole !== role) {
    return (
      <Navigate
        to={userRole === "admin" ? "/dashboard/admin" : "/dashboard/user"}
        replace
      />
    );
  }


  return children;
};


/* ---------------- APP LAYOUT ---------------- */
function AppLayout() {
  const location = useLocation();


  const hideFooterRoutes = [
    "/forgot-password",
    "/checkout",
    "/invoice",
    "/dashboard/admin",
    "/admin/users",
    "/admin/products",
    "/admin/manage-orders",
    "/manage-services"
  ];


  return (
    <>
      <Navbar />


      <div style={{ minHeight: "calc(100vh - 160px)" }}>
        <Routes>


          {/* HOME */}
          <Route path="/" element={<Home />} />


          {/* DEFAULT REDIRECTS */}
          <Route path="/rent" element={<Navigate to="/rent/laptop" replace />} />
          <Route path="/sale" element={<Navigate to="/sale/laptop" replace />} />


          {/* PRODUCTS */}
          <Route path="/products" element={<Products />} />
          <Route path="/:type/:category" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />


          {/* CART */}
          <Route path="/cart" element={<Cart />} />


          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />


          {/* INVOICE */}
          <Route
            path="/invoice"
            element={
              <ProtectedRoute role="customer">
                <Invoice />
              </ProtectedRoute>
            }
          />


          {/* ORDER SUCCESS */}
          <Route path="/order-success" element={<OrderSuccess />} />


          {/* SERVICES */}
          <Route
            path="/raise-service"
            element={
              <ProtectedRoute role="customer">
                <RaiseService />
              </ProtectedRoute>
            }
          />


          <Route
            path="/dashboard/my-services"
            element={
              <ProtectedRoute role="customer">
                <MyServices />
              </ProtectedRoute>
            }
          />


          <Route
            path="/manage-services"
            element={
              <ProtectedRoute role="admin">
                <ManageServices />
              </ProtectedRoute>
            }
          />


          {/* AUTH */}
          <Route path="/login/user" element={<Login userType="user" />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/access-required" element={<AccessRequired />} />


          {/* USER DASHBOARD */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute role="customer">
                <UserDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/my-orders"
            element={
              <ProtectedRoute role="customer">
                <MyOrders />
              </ProtectedRoute>
            }
          />


          <Route
            path="/dashboard/edit-profile"
            element={
              <ProtectedRoute role="customer">
                <EditProfile />
              </ProtectedRoute>
            }
          />


          <Route
            path="/contact-us"
            element={
              <ProtectedRoute role="customer">
                <ContactUs />
              </ProtectedRoute>
            }
          />


          {/* ADMIN DASHBOARD */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/add-product"
            element={
              <ProtectedRoute role="admin">
                <AddProduct />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/rentals"
            element={
              <ProtectedRoute role="admin">
                <AdminRentals />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/users/edit/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminEditUser />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <AdminReports />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/manage-orders"
            element={
              <ProtectedRoute role="admin">
                <ManageOrders />
              </ProtectedRoute>
            }
          />

          <Route
  path="/admin/view-all-orders"
  element={
    <ProtectedRoute role="admin">
      <ViewAllOrders />
    </ProtectedRoute>
  }
/>


          {/* STATIC */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/return" element={<ReturnPolicy />} />


          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />


        </Routes>
      </div>


      {/* FOOTER */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}


      {/* BOTTOM NAV */}
      <BottomNav />
    </>
  );
}


/* ---------------- APP ROOT ---------------- */
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </CartProvider>
  );
}


export default App;

