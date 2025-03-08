// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Exchange from "./pages/Exchange";
import Donate from "./pages/Donate";
import Freelance from "./pages/Freelance";
import Transport from "./pages/Transport";
import Footer from "./components/Footer";
import AccountPage from "./pages/Account";
import SignInPage from "./pages/Signin";
import SignUpPage from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./components/shop/ProductDetails";
import ForgetPasswordPage from "./pages/ForgetPassword";
import DoneDetails from "./components/donate/DoneDeatils";
import GigDetails from "./components/freelance/GigDeatils";
import ExchangeDetails from "./components/exchange/ExchangeDeatils";
import TransportDetails from "./components/transport/TransportDetails";
import ShoppingCart from "./pages/ShoppingCart";
import DashboardPage from "./components/account/DashboardPage";
import { useState } from "react";
import AdminPage from "./pages/Admin";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {!isAdmin ? (
          <Router>
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/freelance" element={<Freelance />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgetPasswordPage />}
                />
                <Route element={<ProtectedRoute />}>
                  {/* protected routes */}
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/exchanges/:id" element={<ExchangeDetails />} />
                  <Route path="/gigs/:id" element={<GigDetails />} />
                  <Route path="/shop/:id" element={<ProductDetails />} />
                  <Route path="/done/:id" element={<DoneDetails />} />
                  <Route path="/transport/:id" element={<TransportDetails />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/shopping-card" element={<ShoppingCart />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </Router>
        ) : (
          <Router>
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Router>
        )}
      </PersistGate>
    </Provider>
  );
};

export default App;
