import { Routes, Route } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminOrders from "./pages/admin-view/orders";
import AdminProducts from "./pages/admin-view/products";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "./store/auth-slice";
import SearchProducts from "./pages/shopping-view/search";
import Payment from "./pages/shopping-view/payment";
import OrderPlaced from "./pages/shopping-view/order-placed";
import FeatureImage from "./pages/admin-view/feature-image";
import GuestGuard from "./components/common/guest-guard";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // const token = JSON.parse(sessionStorage.getItem("token"));
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* common components */}
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              isLoading={isLoading}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              isLoading={isLoading}
            >
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              isLoading={isLoading}
            >
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="feature-image" element={<FeatureImage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              isLoading={isLoading}
            >
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="cart" element={<ShoppingCheckout />} />
          <Route
            path="account"
            element={
              <GuestGuard>
                <ShoppingAccount />
              </GuestGuard>
            }
          />
          <Route
            path="payment"
            element={
              <GuestGuard>
                <Payment />
              </GuestGuard>
            }
          />
          <Route
            path="order-placed"
            element={
              <GuestGuard>
                <OrderPlaced />
              </GuestGuard>
            }
          />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/unauth-page" element={<UnauthPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
