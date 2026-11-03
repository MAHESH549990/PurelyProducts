const path = require("node:path");
const reactEntry = path.resolve(__dirname, "../public/app/index.html");

function cleanForClient(value) {
  const serialized = JSON.parse(JSON.stringify(value ?? {}));
  const clean = item => {
    if (Array.isArray(item)) return item.map(clean);
    if (item && typeof item === "object") {
      for (const key of Object.keys(item)) {
        if (["hash", "salt", "password", "__v"].includes(key)) delete item[key];
        else item[key] = clean(item[key]);
      }
    }
    return item;
  };
  return clean(serialized);
}

// Called explicitly by a page controller; data sent to React is limited to the
// locals that controller provides and has credential fields removed. Browser
// navigation receives the shared React shell for every page route.
module.exports = function renderPage(req, res, view, data = {}) {
  if ((req.get("accept") || "").toLowerCase().includes("application/json")) {
    const currUser = req.user && {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address
    };
    return res.json({ view, data: cleanForClient({
      success: res.locals.success || [],
      error: res.locals.error || [],
      ...data,
      currUser: currUser || null
    }) });
  }
  return res.sendFile(reactEntry);
};

