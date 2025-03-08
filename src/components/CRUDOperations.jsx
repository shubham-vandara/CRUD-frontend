import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const CRUDOperations = () => {
  const apiURL = import.meta.env.VITE_API_URL;

  console.log("API URL:", import.meta.env.VITE_API_URL);

  // State management
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  // Fetch users from the API
  const getUsers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      setUsers(data); // Update users first

      // Use a callback inside setState to ensure loading is set after state update
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Ensure loader hides even on error
    }
  };

  // Runs only on the first render
  useEffect(() => {
    setLoading(true);
    getUsers();
    setLoading(false);
  }, []);

  // Create a new user
  const createUser = async () => {
    if (!name || !email || !password) {
      return alert("All the input fields are necessary to fill... :)");
    }
    setLoading(true);
    try {
      await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      clearInputs();
      await getUsers(); // Wait for the users to update before stopping the loader
    } catch (error) {
      console.error("Error creating user:", error);
    }
    setLoading(false);
  };

  // Update a user
  const updateUser = async () => {
    setLoading(true); // Show loader
    try {
      await fetch(`${apiURL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      clearInputs();
      setEditingId(false);
      await getUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setLoading(false); // Hide loader
  };

  // Delete a user
  const deleteUser = async (id) => {
    setLoading(true); // Show loader
    try {
      await fetch(`${apiURL}/${id}`, { method: "DELETE" });
      await getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setLoading(false); // Hide loader
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
      <h1 className="text-center bg-sky-400 py-4 mb-4 text-2xl rounded-md">
        CRUD Operations
      </h1>
      <div className="bg-sky-200 p-4 mb-4 rounded-md text-center">
        <h2 className="text-2xl mb-2">
          {editingId ? "Update User" : "Create User"}
        </h2>
        <input
          className="bg-white border border-slate-200 rounded-md p-2 mr-4 outline-none"
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
            className="bg-purple-500 text-white py-2 px-4 rounded-md"
            onClick={createUser}
          >
            Create
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : users.length !== 0 ? (
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
                      className="bg-sky-600 text-white p-2 rounded-md mr-2"
                      onClick={() => editUser(user)}
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 mr-2 rounded-md"
                      onClick={() => deleteUser(user.id)}
                    >
                      <MdOutlineDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className="text-2xl font-semibold text-gray-600">
            No data available
          </h1>
          <p className="text-gray-500 mt-2">
            Kindly add some users to display them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default CRUDOperations;
