const API_BASE = import.meta.env.VITE_API_BASE;

export const loginClient = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/client/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json(); // Parse once

  if (!res.ok) {
    throw { status: res.status, message: data.message || "Login failed" };
  }
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);

  //for user table id
  localStorage.setItem("client_id", data.user_id);

  localStorage.setItem("client_name", data.client_name);

  //for client table id
  localStorage.setItem("client_table_id", data.client_id);

  return data;
};

export const registerClient = async (formData) => {
  console.log(formData);
  const res = await fetch(`${API_BASE}/auth/client/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message || "Registration failed",
    };
  }
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);

  //for user table id
  localStorage.setItem("client_id", data.user_id);

  localStorage.setItem("client_name", data.client_name);

  //for client table id
  localStorage.setItem("client_table_id", data.client_id);

  return data;
};

export const logoutClient = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/";
};
