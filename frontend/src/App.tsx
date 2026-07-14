import { Route, Routes } from "react-router";
// toast
import { Toaster } from "sonner";

// layout
import UserLayoutProvider from "./layout/UserLayoutProvider";
import AdminLayout from "./layout/AdminLayout";

// auth
import SplashScreen from "./components/common/SplashScreen";
import GetStarted from "./page/auth/GetStarted";
import ForgotPassword from "./page/auth/password/ForgotPassword";
import ResetPassword from "./page/auth/password/ResetPassword";
import ResetPWSuccess from "./page/auth/password/ResetPWSuccess";
import FBScreen from "./page/auth/user/FBScreen";
// user
import Login from "./page/auth/user/Login";
import Register from "./page/auth/user/Register";
import VerifyLogin from "./page/auth/user/VerifyLogin";
import VerifyForgotPassword from "./page/auth/user/VerifyForgotPassword";
// admin
import FBScreenAdmin from "./page/auth/admin/FBAdmin";
import LoginAdmin from "./page/auth/admin/LoginAdmin";

// User - Page
import Home from "./page/home/Home";
import Product from "./page/home/Product";
import Profile from "./page/home/Profile";
import OrderPage from "./page/order/OrderPage";
import Checkout from "./page/product/Checkout";
import OrderTrackingPage from "./page/order/tabs/OrderTrackingPage";
import CheckoutDetail from "./page/product/CheckoutDetail";
import EditProfile from "./page/profile/EditProfile";
import ScreenCS from "./page/chat/ScreenCS";
import CustomitationWithAi from "./page/product/CustomitationWithAi";
import PengembalianPage from "./page/order/PengembalianPage";
import NewestProduct from "./page/product/NewestProduct";
// product
import ProductDetail from "./page/product/ProductDetail";
// cart
import Cart from "./page/product/Cart";

// admin
import DashboardAdmin from "./page/admin/DashboardAdmin";
import OrderAdmin from "@/page/admin/OrderAmin";
import ProductAdmin from "./page/admin/ProductAdmin";
import KustomisasiAdmin from "./page/admin/KustomisasiAdmin";

import ProtectedRoutes from "./middleware/ProtectedRoutes";
import ProtectedAdminRoute from "./middleware/ProtectedAdminRoute";
import UserLayout from "./layout/WithNavbarLayout";
import RincianPesananPage from "./page/order/RincianPesanan";
import RincianPesananAdmin from "./page/admin/RincianPesananAdmin";
import NotFoundPage from "./components/common/NotFoundPage";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <Routes>
        {/* admin */}
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/product" element={<ProductAdmin />} />
            <Route path="/admin/kustomisasi" element={<KustomisasiAdmin />} />
            <Route path="/admin/order" element={<OrderAdmin />} />
          </Route>
          <Route
            path="/admin/rincian-pesanan/:id"
            element={<RincianPesananAdmin />}
          />
        </Route>

        {/* user */}
        <Route element={<UserLayoutProvider />}>
          <Route element={<UserLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/products/terbaru" element={<NewestProduct />} />
          </Route>

          <Route path="/product/:id" element={<ProductDetail />} />
          {/* profile */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/order" element={<OrderPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        <Route element={<ProductDetail />} path="/product/:id" />
        <Route element={<EditProfile />} path="/edit-profile" />

        {/* chat */}
        <Route element={<ScreenCS />} path="/chat-bot" />
        <Route element={<RincianPesananPage />} path="/rincian-pesanan/:id" />

        {/* cart */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<Cart />} path="/cart" />
          {/* cart */}
          <Route element={<Checkout />} path="/checkout" />
          <Route element={<CheckoutDetail />} path="/checkout/:id/detail" />
        </Route>
        {/* customitation AI */}
        <Route
          element={<CustomitationWithAi />}
          path="/product/customitation"
        />

        <Route element={<PengembalianPage />} path="/pengembalian/:id" />
        <Route element={<OrderTrackingPage />} path="/order/tracking" />

        {/* spalsh */}
        <Route path="/" element={<SplashScreen />} />
        {/* auth */}
        <Route path="/get-started" element={<GetStarted />} />
        {/* users */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/2fa" element={<VerifyLogin />} />
        <Route path="/fb-screen" element={<FBScreen />} />

        {/* admin */}
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/fb-screen-admin" element={<FBScreenAdmin />} />

        {/* password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password-verify"
          element={<VerifyForgotPassword />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-success" element={<ResetPWSuccess />} />

        {/* not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
