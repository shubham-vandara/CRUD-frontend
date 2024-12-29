import { useState, useEffect } from "react";

const CRUDOperations = () => {
  const apiURL = "http://localhost:8080/frontUser";

  // State management
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(false);

  // Fetch users from the API
  const getUsers = async () => {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Runs only on the first render
  useEffect(() => {
    getUsers();
  }, []);

  // Create a new user
  const createUser = async () => {
    if (!name || !email || !password) {
      return alert("All the input fields are necessary to fill... :)");
    }
    try {
      await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      clearInputs();
      getUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Update a user
  const updateUser = async () => {
    try {
      await fetch(`${apiURL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      clearInputs();
      setEditingId(false);
      getUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await fetch(`${apiURL}/${id}`, { method: "DELETE" });
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Edit a user
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setEditingId(user.id);
  };

  // Clear input fields
  const clearInputs = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="m-8">
      <h1 className="text-center bg-orange-300 py-4 mb-4 text-2xl rounded-md">
        CRUD Operations
      </h1>
      <div className="bg-lime-200 p-4 mb-4 rounded-md text-center">
        <h2 className="text-2xl mb-2">
          {editingId ? "Update User" : "Create User"}
        </h2>
        <input
          className="bg-white border border-slate-300 rounded-md p-2 mr-4 outline-none"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="bg-white border border-slate-300 rounded-md p-2 mr-4 outline-none"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="bg-white border border-slate-300 rounded-md p-2 mr-4 outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {editingId ? (
          <button
            className="bg-emerald-600 text-white py-2 px-4 rounded-md"
            onClick={updateUser}
          >
            Update
          </button>
        ) : (
          <button
            className="bg-purple-400 text-white py-2 px-4 rounded-md"
            onClick={createUser}
          >
            Create
          </button>
        )}
      </div>

      <div>
        <h2 className="text-2xl text-center bg-rose-200 py-3 rounded-md mb-4">
          Front Users List
        </h2>
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Password</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="px-4 py-2 text-center border">{user.id}</td>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.password}</td>
                <td className="px-4 py-2 text-center border">
                  <button
                    className="bg-red-500 text-white py-1 px-2 mr-2 rounded-md"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-sky-600	 text-white py-1 px-2 rounded-md mr-2"
                    onClick={() => editUser(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRUDOperations;
