import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import "./Admin.css";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      let userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Sort: Admins first, then normal users
      userList.sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;
        return (a.email || "").localeCompare(b.email || "");
      });

      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Generate initials from name/email
  const getInitials = (name, email) => {
    const base = name || email || "?";
    const words = base.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className="users-container">
      <h2 className="users-title">Users Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Orders Count</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={user.role === "admin" ? "admin-row" : ""}
              >
                <td className="user-info">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name || user.email}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar generated">
                      {getInitials(user.name, user.email)}
                    </div>
                  )}
                  <span>{user.name || "-"}</span>
                </td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`role-badge ${
                      user.role === "admin" ? "admin" : "user"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td>{user.orders?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
