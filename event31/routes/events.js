const { Router } = require("express");
const Event = require("../models/event");
const auth = require("../middleware/auth");
const { eventValidators } = require("../utils/validators");
const router = Router();

function isOwner(event, req) {
  return event.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("userId", "email name")
      .select("price title img time date description");

    res.render("events", {
      title: "События",
      isEvents: true,
      userId: req.user ? req.user._id.toString() : null,
      events
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!isOwner(event, req)) {
      return res.redirect("/events");
    }
    res.render("event-edit", {
      title: `Редактировать ${event.title}`,
      event
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", auth, eventValidators, async (req, res) => {
  const { id } = req.body;

  if (req.file) {
    req.body.img = req.file.filename;
  }

  try {
    delete req.body.id;
    const event = await Event.findById(id);
    if (!isOwner(event, req)) {
      return res.redirect("/events");
    }
    Object.assign(event, req.body);
    await event.save();
    res.redirect("/events");
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Event.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    });
    res.redirect("/events");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render("event", {
      layout: "empty",
      title: `Событие ${event.title}`,
      event
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
