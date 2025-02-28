import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users
        const response = await axios.get("https://api.prumolet.com/api/users");
        const usersData = response.data;

        // Fetch order data for each user
        const usersWithOrders = await Promise.all(
          usersData.map(async (user) => {
            try {
              const ordersResponse = await axios.get(
                `https://api.prumolet.com/api/users/${user._id}/orders`
              );
              const { ordersCount, totalSpent } = ordersResponse.data;

              return {
                ...user,
                ordersCount: ordersCount || 0, // Set to 0 if no orders
                totalSpent: totalSpent || 0, // Set to 0 if no totalSpent
              };
            } catch (error) {
              // If there is an error fetching orders, assume 0 orders and 0 totalSpent
              return {
                ...user,
                ordersCount: 0,
                totalSpent: 0,
              };
            }
          })
        );

        setUsers(usersWithOrders);
      } catch (error) {
        console.error("Error fetching users or orders:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDownloadExcel = () => {
    if (!users || users.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Create a new worksheet from the users data, including ordersCount and totalSpent
    const worksheet = XLSX.utils.json_to_sheet(
      users.map(({ _id, fname, lname, email,role, createdAt, ordersCount, totalSpent }) => ({
        UserID: _id,
        Name: `${fname} ${lname}`,
        Email: email,
        User: role,
        CreatedAt: new Date(createdAt).toLocaleDateString(),
        OrdersCount: ordersCount,
        TotalSpent: totalSpent.toFixed(2), // Format as two decimal points
      }))
    );

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Write the workbook and trigger the download
    XLSX.writeFile(workbook, "UsersData.xlsx");
  };

  return (
    <div className="tab-pane fade" id="Users">
      <div className="dashboard-table">
        <div className="wallet-table">
          <div className="top-sec">
            <h3>All Users</h3>
            <button onClick={handleDownloadExcel} className="btn btn-primary">
              Download Excel
            </button>
          </div>
          <div className="table-responsive">
            <table className="table cart-table order-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User</th>
                  <th>Created At</th>
                  <th>Orders Count</th>
                  <th>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>
                        {user.fname} {user.lname}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>{user.ordersCount}</td>
                      <td>{user.totalSpent.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
