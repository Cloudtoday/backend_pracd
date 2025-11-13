// Simple in-memory blacklist for JWTs by JTI
// Note: For production, prefer a shared store (e.g., Redis).

const blacklist = new Map(); // jti -> expMs (epoch ms)

function addToBlacklist(jti, expSeconds) {
  if (!jti || !expSeconds) return;
  const expMs = expSeconds * 1000;
  blacklist.set(jti, expMs);
}

function isBlacklisted(jti) {
  if (!jti) return false; // tokens without jti cannot be checked
  const expMs = blacklist.get(jti);
  if (!expMs) return false;
  if (Date.now() >= expMs) {
    // expired entry cleanup
    blacklist.delete(jti);
    return false;
  }
  return true;
}

// Periodic cleanup to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [jti, expMs] of blacklist.entries()) {
    if (now >= expMs) blacklist.delete(jti);
  }
}, 60 * 1000).unref?.();

module.exports = { addToBlacklist, isBlacklisted };

