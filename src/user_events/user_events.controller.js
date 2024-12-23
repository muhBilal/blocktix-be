const {
  getUserEventById,
  inserUserEvent,
  updateUserEventStatus,
  getall,
} = require("./user_events.service");
const { ZodError } = require("zod");
const { fromZodError } = require("zod-validation-error");
const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const ue = await getall();
    res.send(ue);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userEventDetail = await getUserEventById(user_id);
    res.send(userEventDetail);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/update", async (req, res) => {
  try {
    const response = await updateUserEventStatus(req.body);
    res.status(201).send(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).send({ message: fromZodError(error).toString() });
    }
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    await inserUserEvent(req.body);
    res.status(201).send({ message: "success" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).send({ message: fromZodError(error).toString() });
    }
    res.status(500).send(error.message);
  }
});

module.exports = router;
