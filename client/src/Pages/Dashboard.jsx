import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarDashboard from "../Components/Dashboard/Sidebar-Dashboard";
import AdminDashboard from "./AdminSide/AdminDashboard";
import { useSelector } from "react-redux";
import CreateMenu from "./AdminSide/EditMenu/CreateMenu.jsx";
import EditMenu from "./AdminSide/EditMenu/EditMenu";
import UpdateMenu from "./AdminSide/EditMenu/UpdateMenu.jsx";
import OrderList from "./AdminSide/Orders/OrderList.jsx";
import OrderID from "./AdminSide/Orders/OrderId.jsx";
import TableList from "./AdminSide/Table/TableList.jsx";
import Members from "./AdminSide/Members/Members.jsx";
function Profile() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const myParam = urlParams.get("tab");
    if (myParam) {
      setTab(myParam);
    }
  }, [location.search]);
  return (
    <>
      {currentUser.message.user.isAdmin && (
        <div className="md:flex">
          <div>
            <SidebarDashboard />
          </div>

          {tab === "dashboard" && <AdminDashboard />}
          {tab === "createMenu" && <CreateMenu />}
          {tab === "updateMenu" && <UpdateMenu />}
          {tab.startsWith('editMenu-')&& tab.length > 'editMenu-'.length && <EditMenu />}
          {tab === "orderList" && <OrderList/>}
         {tab === "orderId" && <OrderID/>}
         {tab === "tableList" && <TableList/>}
         {tab === "customerList" && <Members/>}
         
        </div>
      )}
    </>
  );
}

export default Profile;
