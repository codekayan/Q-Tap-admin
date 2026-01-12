import "./App.css";
import { BranchesPage } from "./Component/Branches/BranchesPage";
import { BusinessInfoPage } from "./Component/Business-info/BusinessInfoPage";
import { DashboardHome } from "./Pages/DashboardHome/DashboardHome";
import { PasswordResetPage } from "./Component/PasswordReset/PasswordResetPage";
import { PaymentPage } from "./Component/payment/PaymentPage";
import { ResetPage } from "./Component/reset/ResetPage";
import { ServingWaysPage } from "./Component/serving Ways/ServingWaysPage";
import { HomePage } from "./Pages/HomePage";
import HomePageAdmin from "./Pages/HomePageAdmin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/DashboardHome/Home/Home";
import Product from "./Pages/product/Product";
import Client from "./Pages/Client/Client";
import Wallet from "./Pages/Wallet/Wallet";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import Support from "./Pages/Support/Support";
import { Pricing } from "./Pages/Pricing/Pricing";
import { Affiliate } from "./Pages/Affiliate/Affiliate";
import { Setting } from "./Pages/Setting/Setting";
import { Notification } from "./Pages/Notification/Notification";
import { LogoClient } from "./Component/DashboardClient/LogoClient";
import { LoginAdmin } from "./Component/DashboardClient/LoginAdmin";
import { OrderBody } from "./Pages/DashboardClient/Order/OrderComponent/OrderBody";
import HomeClient from "./Pages/DashboardClient/Pages/DashHome/HomeClient";
import { DashboardClient } from "./Pages/DashboardClient/Pages/DashHome/DashboardClient";
import { Order } from "./Pages/DashboardClient/Pages/Order/Order";
import { WalletClient } from "./Pages/DashboardClient/Pages/WalletClient/WalletClient";
import { Menu } from "./Pages/DashboardClient/Pages/Menu/Menu";
import SupportClient from "./Pages/DashboardClient/Pages/SupportClient/SupportClient";
import { Customers } from "./Pages/DashboardClient/Pages/Customers/Customers";
import { SettingClient } from "./Pages/DashboardClient/Pages/SettingClient/SettingClient";
import { OrderHistory } from "./Pages/DashboardClient/Order/OrderComponent/OrderHistory";
import { Transaction } from "./Pages/DashboardClient/Pages/WalletClient/Transaction/Transaction";
import { User } from "./Pages/DashboardClient/Pages/User/User";
import { AddItem } from "./Pages/DashboardClient/Pages/Menu/AddItem";
import { Feedback } from "./Pages/DashboardClient/Pages/Feedback/Feedback";
import { AddClient } from "./Pages/Client/Row2/AddClient/AddClient";

import { AddUsers } from "./Pages/Affiliate/AddUser/AddUser";

import HomeAffiliate from "./Pages/DashboardAffiliate/Pages/DashboardHome/HomeAffiliate";
import { DashboardAffiliate } from "./Pages/DashboardAffiliate/Pages/DashboardHome/DashboardAffiliate";
import { WalletAffiliate } from "./Pages/DashboardAffiliate/Pages/WalletAffiliate/WalletAffiliate";
import { DeliveryLogin } from "./Pages/DashboardClient/DeliveryRiders/DeliveryLogin";
import { Delivered } from "./Pages/DashboardClient/DeliveryRiders/Delivered";
import MenuClient from "./Pages/DashboardClient/Menu/MenuClient";
import { FeedbackAdmin } from "./Pages/FeedbackAdmin/FeedbackAdmin";
import { Save } from "./Component/Save/Save";
import { Welcome } from "./Component/Welcome/Welcome";
import { ProductsPage } from "./Component/Products/ProductsPage";
import { ToastContainer } from "react-toastify";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { LoginChef } from "./Component/DashboardClient/LoginChef";
import { LoginCashier } from "./Component/DashboardClient/LoginCashier";
import { LoginKitchen } from "./Component/DashboardClient/LoginKitchen";
import { LoginWaiter } from "./Component/DashboardClient/LoginWaiter";
import { AddRole } from "./Pages/DashboardClient/Pages/User/AddRole";
import HomePageAffiliate from "./Pages/HomePageAffiliate";
import { AddAffiliate } from "./Pages/DashboardAffiliate/Pages/WalletAffiliate/AddAffiliate";
import { ReceivePage } from "./Component/receiveCode/ReceivePage";
import { ResetPageAffiliate } from "./Pages/DashboardAffiliate/ResetPasswordAffiliate/reset/ResetPageAffiliate";
import { ReceivePageAffiliate } from "./Pages/DashboardAffiliate/ResetPasswordAffiliate/receiveCode/ReceivePageAffiliate";
import { PasswordResetPageAffiliate } from "./Pages/DashboardAffiliate/ResetPasswordAffiliate/PasswordReset/PasswordResetPageAffiliate";
import { ResetPageAdmin } from "./Pages/DashboardHome/ResetPasswordAdmin/reset/ResetPageAdmin";
import { ReceivePageAdmin } from "./Pages/DashboardHome/ResetPasswordAdmin/receiveCode/ReceivePageAdmin";
import { PasswordResetPageAdmin } from "./Pages/DashboardHome/ResetPasswordAdmin/PasswordReset/PasswordResetPageAdmin";
import { Help } from "./Component/Help/Help";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import { HelpAffiliate } from "./Component/login/HelpAffiliate";
import { HelpClient } from "./Component/Help/HelpClient";
import ProtectedRouteClient from "./Component/ProtectedRoute/ProtectedRouterClient";
import { TestWebLogin } from "./Component/TestWebLogin";
import { OtpSignupPage } from "./Component/Otp/OtpSingupPage";
import ClientPlan from "./Pages/DashboardClient/Pages/client-plane-page/ClientPlan";
import ClientsPlanTables from "./Pages/Admin/Clients-Plan-Tables/ClientsPlanTables";
import EditBusinessInfo from "./Pages/register-busniess-info-page/EditBusinessInfo";
import RegisterLayout from "./Pages/layout/RegisterLayout";

const queryClient = new QueryClient();

function App() {
  const routes = createBrowserRouter(
    [
      {
        path: "/",
        element: <HomePage />, // done
      },
      {
        path: "/affiliate-login",
        element: <HomePageAffiliate />, // done
      },
      {
        path: "/admin",
        element: <HomePageAdmin />, // done
      },
      {
        path: "/reset",
        element: <ResetPage />, //  done client reset pass
      },
      {
        path: "/receive-code",
        element: <ReceivePage />, // done client reset pass
      },
      {
        path: "/reset-password",
        element: <PasswordResetPage />, // done client reset pass
      },
      {
        path: "/reset-affiliate",
        element: <ResetPageAffiliate />, //  done  affiliate reset pass
      },
      {
        path: "/receive-code-affiliate",
        element: <ReceivePageAffiliate />, // done  affiliate reset pass
      },
      {
        path: "/reset-password-affiliate",
        element: <PasswordResetPageAffiliate />, // done  affiliate reset pass
      },
      {
        path: "/reset-admin",
        element: <ResetPageAdmin />, //  done  admin reset pass
      },
      {
        path: "/receive-code-admin",
        element: <ReceivePageAdmin />, // done  admin reset pass
      },
      {
        path: "/reset-password-admin",
        element: <PasswordResetPageAdmin />, // done  admin reset pass
      },
      {
        element: <RegisterLayout />,
        children: [
          {
            path: "/product",
            element: <ProductsPage />, // done
          },
          {
            path: "/business-info",
            element: <EditBusinessInfo />, // <BusinessInfoPage />, // done
          },
          {
            path: "/business-info/edit/:id",
            element: <EditBusinessInfo />, // done
          },
          {
            path: "/serving-ways",
            element: <ServingWaysPage />, // done
          },
          {
            path: "/branches",
            element: <BranchesPage />, // done
          },
          {
            path: "/payment",
            element: <PaymentPage />, // done
          },
          {
            path: "/save",
            element: <Save />, // DONE
          },
          {
            path: "/welcome",
            element: <Welcome />, // done
          },
          {
            path: "/otp-signup",
            element: <OtpSignupPage />, // done
          },
        ],
      },

      /// client
      {
        path: "/logo-cient",
        element: <LogoClient />, // done
      },
      {
        path: "/admin-login",
        element: <LoginAdmin />, //  done
      },
      {
        path: "/kitchen-login",
        element: <LoginKitchen />, //  done
      },
      {
        path: "/chef-login",
        element: <LoginChef />, //  done
      },
      {
        path: "/waiter-login",
        element: <LoginWaiter />, //  done
      },
      {
        path: "/cashier-login",
        element: <LoginCashier />, //  done
      },
      {
        path: "order-body",
        element: <OrderBody />, // done
      },
      {
        path: "order-history",
        element: (
          <ProtectedRouteClient
            allowedRoles={["admin"]}
            redirectPath={"/order-body"}
          >
            <OrderHistory />
          </ProtectedRouteClient>
        ), // done
      },
      {
        path: "order",
        element: <Order />, // done
      },
      {
        path: "add-item",
        element: (
          <ProtectedRouteClient allowedRoles={["admin"]} redirectPath={"/"}>
            <AddItem />
          </ProtectedRouteClient>
        ), // done
      },
      {
        path: "add-client",
        element: (
          <ProtectedRouteClient allowedRoles={["admin"]} redirectPath={"/"}>
            {" "}
            <AddClient />
          </ProtectedRouteClient>
        ), // done
      },
      {
        path: "add-user",
        element: (
          <ProtectedRouteClient allowedRoles={["admin"]} redirectPath={"/"}>
            <AddUsers />,
          </ProtectedRouteClient>
        ), // done
      },
      {
        path: "add-role",
        element: (
          <ProtectedRouteClient allowedRoles={["admin"]} redirectPath={"/"}>
            <AddRole />
          </ProtectedRouteClient>
        ), // done
      },
      {
        path: "add-Affiliate",
        element: <AddAffiliate />, // done
      },
      {
        path: "delivery-riders",
        element: <DeliveryLogin />, // done
      },
      {
        path: "delivered",
        element: <Delivered />, // done
      },

      {
        path: "menu-client", // todo: disapple pay button
        element: (
          <ProtectedRouteClient
            allowedRoles={["admin", "cashier"]}
            redirectPath={"/order-body"}
          >
            <MenuClient />
          </ProtectedRouteClient>
        ), // TODO: style problem here  and logic modification
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "help-client",
        element: <HelpClient />,
      },
      {
        path: "help-affiliate",
        element: <HelpAffiliate />,
      },
      {
        path: "test-web-login",
        element: <TestWebLogin />,
      },

      //  dashboard-Affiliate
      {
        path: "/",
        element: (
          <ProtectedRoute role="affiliate">
            <HomeAffiliate />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            path: "/dashboard-affiliate",
            element: <DashboardAffiliate />,
          },
          {
            path: "wallet-affiliate",
            element: <WalletAffiliate />,
          },
        ],
      },
      // dashboard-client
      {
        path: "/",
        element: (
          <ProtectedRouteClient allowedRoles={["admin"]} redirectPath={"/"}>
            <HomeClient />
          </ProtectedRouteClient>
        ),
        children: [
          {
            index: true,
            path: "/dashboard-client",
            element: <DashboardClient />,
          },
          {
            path: "wallet-client",
            element: <WalletClient />,
          },
          {
            path: "transaction",
            element: <Transaction />, // لم يتم الترجمه
          },

          {
            path: "menu",
            element: <Menu />,
          },

          {
            path: "support-client",
            element: <SupportClient />,
          },
          {
            path: "user",
            element: <User />,
          },
          {
            path: "customers-log",
            element: <Customers />,
          },

          {
            path: "setting-client",
            element: <SettingClient />,
          },

          {
            path: "feedback",
            element: <Feedback />,
          },
          {
            index: true,
            path: "/client-plan",
            element: <ClientPlan />,
          },
        ],
      },
      // dashboard-Admin
      {
        path: "/",
        element: (
          <ProtectedRoute role="admin">
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            path: "dashboard-home",
            element: <DashboardHome />,
          },
          {
            path: "client",
            element: <Client />,
          },
          {
            path: "wallet",
            element: <Wallet />,
          },
          {
            path: "product-admin",
            element: <Product />,
          },
          {
            path: "support",
            element: <Support />,
          },
          {
            path: "pricing",
            element: <Pricing />,
          },
          {
            path: "affiliate",
            element: <Affiliate />,
          },
          {
            path: "setting",
            element: <Setting />,
          },
          {
            path: "notification",
            element: <Notification />,
          },
          {
            path: "/feedback-admin",
            element: <FeedbackAdmin />,
          },
          {
            path: "/plan-action",
            element: <ClientsPlanTables />,
          },
        ],
        errorElement: <ErrorPage />,
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ]
    // ,{
    //   basename: '/dashboard', // 👈 Important!
    //   // package.json -> // "homepage": "/dashboard/",
    // }
  );

  useEffect(() => {
    const pusher = new Pusher("63b495891d2c3cff9d36", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("notify-channel");
    channel.bind("form-submitted", function (data) {
      // console.log('📢 Received from Pusher:', data);

      // Handle different types
      switch (data?.type) {
        case "notfy":
          // Handle notification type
          toast.info(`📢 ${data?.message?.title}: ${data?.message?.content}`);
          break;

        case "chat":
          // Handle chat type
          {
            localStorage.getItem("adminToken") &&
              toast.success(`💬 New Message: ${data?.message?.message}`);
          }
          // Add logic to update chat UI or state
          break;

        // case 'add_order':
        //   // Handle add_order type
        //   // toast.warn(`🛒 New Order: ${data?.message?.orderId}`);
        //   // Add logic to update order UI or state
        //   break;

        default:
          console.warn("Unknown data type received:", data);
      }
    });

    // Cleanup on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);
  console.log("qtap version 1");
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes}></RouterProvider>
        <ToastContainer />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
