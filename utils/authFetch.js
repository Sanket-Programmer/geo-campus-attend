export const authFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");

      window.location.href = "/";
      return null;
    }

    return res;
  } catch (err) {
    console.error("authFetch error:", err);
    throw err;
  }
};

