import HomePage from './customer/HomePage';
import ProductPage from './customer/ProductPage';
import CartRoutePage from './customer/CartRoutePage';
import CheckoutPage from './CheckoutPage';
import EmptyCartPage from './EmptyCartPage';
import OrdersRoutePage from './customer/OrdersRoutePage';
import EmptyOrdersPage from './EmptyOrdersPage';
import OrderDetailsRoutePage from './customer/OrderDetailsRoutePage';
import ProfileRoutePage from './customer/ProfileRoutePage';
import AddressRoutePage from './customer/AddressRoutePage';
import UpdateAddressRoutePage from './customer/UpdateAddressRoutePage';
import DeliveryRequestRoutePage from './customer/DeliveryRequestRoutePage';
import DashboardRoutePage from './customer/DashboardRoutePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ForgetPasswordPage from './ForgetPasswordPage';
import ErrorPage from './ErrorPage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminProductsPage from './admin/AdminProductsPage';
import InventoryPage from './admin/InventoryPage';
import AddProductPage from './admin/AddProductPage';
import EditProductPage from './admin/EditProductPage';
import AdminProductDetailsPage from './admin/AdminProductDetailsPage';
import CustomersPage from './admin/CustomersPage';
import CustomerDetailsPage from './admin/CustomerDetailsPage';
import TopProductsPage from './admin/TopProductsPage';
import PendingOrdersPage from './admin/PendingOrdersPage';
import ConfirmedOrdersPage from './admin/ConfirmedOrdersPage';
import DeliveryApplicationsPage from './admin/DeliveryApplicationsPage';
import DeliveryRequestsPage from './admin/DeliveryRequestsPage';
import AssignDeliveryPage from './admin/AssignDeliveryPage';
import ApprovedPartnerDetailsPage from './admin/ApprovedPartnerDetailsPage';
import AdminProfilePage from './admin/AdminProfilePage';
import DeliveryDashboardPage from './delivery/DeliveryDashboardPage';
import AssignedOrdersPage from './delivery/AssignedOrdersPage';
import OutForDeliveryPage from './delivery/OutForDeliveryPage';
import DeliveredOrdersPage from './delivery/DeliveredOrdersPage';
import AssignedOrderDetailsPage from './delivery/AssignedOrderDetailsPage';
import DeliveryProfilePage from './delivery/DeliveryProfilePage';

// Each old server-rendered view has an explicit React page entry. Shared layouts
// keep navigation and forms consistent while route modules remain independently editable.
export const pageRegistry = {
 'routes/home.ejs':HomePage,
 'routes/productDetails.ejs':ProductPage,
 'routes/cart.ejs':CartRoutePage,
 'routes/noItemCart.ejs':EmptyCartPage,
 'routes/cardPayment.ejs':CheckoutPage,
 'routes/userOrders.ejs':OrdersRoutePage,
 'routes/emptyOrders.ejs':EmptyOrdersPage,
 'routes/orderedProductDetails.ejs':OrderDetailsRoutePage,
 'routes/profile.ejs':ProfileRoutePage,
 'routes/userAddress.ejs':AddressRoutePage,
 'routes/updateAddress.ejs':UpdateAddressRoutePage,
 'routes/deliveryRequest.ejs':DeliveryRequestRoutePage,
 'routes/userDashboard.ejs':DashboardRoutePage,
 'userLogin/login.ejs':LoginPage,
 'userLogin/signup.ejs':SignupPage,
 'userLogin/forgetPass.ejs':ForgetPasswordPage,
 'routes/error.ejs':ErrorPage,
 'routes/dashboard.ejs':AdminDashboardPage,
 'routes/products.ejs':AdminProductsPage,
 'routes/inventory.ejs':InventoryPage,
 'routes/AddNewProduct.ejs':AddProductPage,
 'routes/UpdateProduct.ejs':EditProductPage,
 'routes/item.ejs':AdminProductDetailsPage,
 'routes/users.ejs':CustomersPage,
 'routes/usersDetails.ejs':CustomerDetailsPage,
 'routes/topProducts.ejs':TopProductsPage,
 'routes/pendingOrders.ejs':PendingOrdersPage,
 'routes/confirmedOrders.ejs':ConfirmedOrdersPage,
 'routes/deliveryboys.ejs':DeliveryApplicationsPage,
 'routes/newDeliveryRequests.ejs':DeliveryRequestsPage,
 'routes/approvedDeliveryDetails.ejs':AssignDeliveryPage,
 'routes/approvedDeliveryBoyDetails.ejs':ApprovedPartnerDetailsPage,
 'routes/adminProfile.ejs':AdminProfilePage,
 'routes/deliveryDashboard.ejs':DeliveryDashboardPage,
 'routes/assignedOrders.ejs':AssignedOrdersPage,
 'routes/outOfDeliveryOrders.ejs':OutForDeliveryPage,
 'routes/deliveredOrders.ejs':DeliveredOrdersPage,
 'routes/assignProductDetails.ejs':AssignedOrderDetailsPage,
 'routes/deliveryPartnerProfile.ejs':DeliveryProfilePage
};
