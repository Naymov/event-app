const { Router } = require("express");
const Event = require("../models/event");
const auth = require("../middleware/auth");
const router = Router();

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.eventId._doc,
    id: c.eventId.id,
    count: c.count
  }));
}

function computePrice(events) {
  return events.reduce((total, event) => {
    return (total += event.price * event.count);
  }, 0);
}

router.post("/add", auth, async (req, res) => {
  const event = await Event.findById(req.body.id);
  await req.user.addToCart(event);
  res.redirect("/card");
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.eventId").execPopulate();
  const events = mapCartItems(user.cart);
  const cart = {
    events,
    price: computePrice(events)
  };
  res.status(200).json(cart);
});

router.get("/", auth, async (req, res) => {
  const user = await req.user.populate("cart.items.eventId").execPopulate();

  const events = mapCartItems(user.cart);

  res.render("card", {
    title: "Корзина",
    isCard: true,
    events,
    price: computePrice(events)
  });
});

module.exports = router;
