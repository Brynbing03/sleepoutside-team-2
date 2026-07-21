import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const baseURL = import.meta.env.PUBLIC_SERVER_URL;

interface UserStore {
  isLoggedIn: boolean;
  user?: {
    name: string;
    email: string;
    _id: string;
  };
  token: string;
}
export const userStore = $state({
  isLoggedIn: false,
  user: {},
  token: "",
}) as UserStore;

export async function login(email: string, password: string) {
  const res = await fetch(`${baseURL}users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log(res);
  const data = await res.json();
  if (res.ok) {
    userStore.user = data.user;
    userStore.token = data.token;
    userStore.isLoggedIn = true;
    setLocalStorage("so-user", userStore);
    return data;
  } else {
    throw new Error(data.error?.message || "Login failed");
  }
}

export function logout() {
  userStore.isLoggedIn = false;
  userStore.user = undefined;
  userStore.token = "";
  setLocalStorage("so-user", null);
  window.location.href = "/";
}

export function checkAuth() {
  const userData = getLocalStorage("so-user");

  if (userData) {
    userStore.user = userData.user;
    userStore.token = userData.token;
    userStore.isLoggedIn = true;
  } else {
    userStore.isLoggedIn = false;
    userStore.user = undefined;
    userStore.token = "";
  }

  // Use !! to turn variable into boolean
  return !!userData;
}
