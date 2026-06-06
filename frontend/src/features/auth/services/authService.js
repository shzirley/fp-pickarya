import { normalizeAuthUser } from "../../../shared/utils/authNavigation";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const USERS_KEY = "pickarya_users";
const SESSION_KEY = "pickarya_session";

const defaultUsers = [
  {
    id: 1,
    email: "buyer@gmail.com",
    password: "12345678",
    role: "buyer",
    username: "unainaina",
    phone: "081234567890",
  },
  {
    id: 2,
    email: "artist@gmail.com",
    password: "12345678",
    role: "artist",
    username: "azazarine",
    artistLevel: "professional",
    phone: "081234567891",
    bankName: "MANDIRI",
    bankAccountNumber: "099278",
  },
];

const normalizeEmail = (email) => email.trim().toLowerCase();
const normalizeUsername = (username) => username.trim().toLowerCase();

const getStoredUsers = () => {
  const storedUsers = localStorage.getItem(USERS_KEY);

  if (!storedUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  const parsedUsers = JSON.parse(storedUsers);

  const mergedUsers = [...parsedUsers];

  defaultUsers.forEach((defaultUser) => {
    const alreadyExists = mergedUsers.some(
      (user) =>
        normalizeEmail(user.email) === normalizeEmail(defaultUser.email) ||
        normalizeUsername(user.username) === normalizeUsername(defaultUser.username)
    );

    if (!alreadyExists) {
      mergedUsers.push(defaultUser);
    }
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(mergedUsers));

  return mergedUsers;
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const removePassword = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan");
  }

  return data;
};

export const checkEmailExists = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (API_BASE_URL) {
    const data = await request("/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email: normalizedEmail }),
    });

    return data.exists;
  }

  const users = getStoredUsers();
  return users.some((user) => normalizeEmail(user.email) === normalizedEmail);
};

export const authenticateWithGoogle = async (credential) => {
  if (!API_BASE_URL) {
    throw new Error("Backend API belum dikonfigurasi");
  }

  const data = await request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });

  if (data.needsSignup) {
    return { needsSignup: true, prefill: data.prefill };
  }

  saveSession(data);
  return { needsSignup: false, session: data };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  if (API_BASE_URL) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    saveSession(data);
    return data;
  }

  const users = getStoredUsers();
  const user = users.find(
    (item) => normalizeEmail(item.email) === normalizedEmail && item.password === password
  );

  if (!user) {
    throw new Error("Password/email salah");
  }

  const session = {
    token: `mock-token-${user.id}`,
    user: removePassword(user),
  };

  saveSession(session);
  return session;
};

export const registerUser = async (payload) => {
  const normalizedEmail = normalizeEmail(payload.email);
  const normalizedUsername = normalizeUsername(payload.username);

  if (API_BASE_URL) {
    const body = {
      ...payload,
      email: normalizedEmail,
      username: normalizedUsername,
    };

    if (payload.googleId) {
      delete body.password;
    }

    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    saveSession(data);
    return data;
  }

  const users = getStoredUsers();

  const emailExists = users.some(
    (user) => normalizeEmail(user.email) === normalizedEmail
  );

  if (emailExists) {
    throw new Error("Email sudah terdaftar/digunakan");
  }

  const usernameExists = users.some(
    (user) => normalizeUsername(user.username) === normalizedUsername
  );

  if (usernameExists) {
    throw new Error("Username sudah digunakan");
  }

  const newUser = {
  id: Date.now(),
  email: normalizedEmail,
  password: payload.password,
  role: payload.role,
  username: normalizedUsername,
  phone: payload.phone || "",
  artistLevel: payload.artistLevel || null,
  bankName: payload.role === "artist" ? payload.bankName || "" : "",
  bankAccountNumber:
    payload.role === "artist" ? payload.bankAccountNumber || "" : "",
};

  const nextUsers = [...users, newUser];
  saveUsers(nextUsers);

  const session = {
    token: `mock-token-${newUser.id}`,
    user: removePassword(newUser),
  };

  saveSession(session);
  return session;
};

export const getCurrentUser = () => {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  return normalizeAuthUser(JSON.parse(session).user);
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const deleteCurrentUserAccount = async () => {
  const session = localStorage.getItem(SESSION_KEY)

  if (!session) {
    throw new Error("Tidak ada akun yang sedang login")
  }

  const parsedSession = JSON.parse(session)
  const currentUser = parsedSession.user

  if (API_BASE_URL) {
    await request("/auth/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${parsedSession.token}`,
      },
    })

    localStorage.removeItem(SESSION_KEY)
    return true
  }

  const users = getStoredUsers()

  const updatedUsers = users.filter(
    (user) => user.id !== currentUser.id
  )

  saveUsers(updatedUsers)
  localStorage.removeItem(SESSION_KEY)

  return true
}

export const resetMockAuthData = () => {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
};
