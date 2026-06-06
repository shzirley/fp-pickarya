export const normalizeAuthUser = (user = {}) => {
  const id = user.id?.toString?.() || user._id?.toString?.() || user.id || user._id;

  return {
    ...user,
    id,
    role: user.role === "artist" ? "artist" : "buyer",
  };
};

export const getPostLoginNavigation = (role) => {
  if (role === "artist") {
    return {
      page: "profile",
      sidebar: "account",
      orderStatus: "artist_incoming",
      role: "artist",
    };
  }

  return {
    page: "home",
    sidebar: "account",
    orderStatus: "waiting",
    role: "buyer",
  };
};
