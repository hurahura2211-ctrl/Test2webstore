/**
 * Demo order store (in-memory). Replace with a real DB in production.
 */
const store = new Map(); // merchantOrderId -> order

function createOrder({ merchantOrderId, email, productId, amount }) {
  const order = { merchantOrderId, email, productId, amount, status: "CREATED" };
  store.set(merchantOrderId, order);
  return order;
}

function setReference(merchantOrderId, reference) {
  const o = store.get(merchantOrderId);
  if (!o) return;
  o.reference = reference;
  store.set(merchantOrderId, o);
}

function markPaid(merchantOrderId) {
  const o = store.get(merchantOrderId);
  if (!o) return null;
  o.status = "PAID";
  // naive download token
  o.token = Buffer.from(merchantOrderId).toString("base64url");
  store.set(merchantOrderId, o);
  return o;
}

function findByToken(token) {
  for (const o of store.values()) {
    if (o.token === token) return o;
  }
  return null;
}

function getOrder(merchantOrderId) {
  return store.get(merchantOrderId) || null;
}

export const Orders = {
  createOrder, setReference, markPaid, getOrder, findByToken
};
