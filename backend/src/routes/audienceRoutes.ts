import { Router } from "express";
import { evaluateAudience } from "../services/audienceEvaluator";
import { validateAudienceRequest } from "../validation/audienceValidation";

const router = Router();

router.post("/preview", (req, res) => {
  const validation = validateAudienceRequest(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      error: {
        code: "INVALID_REQUEST",
        message: validation.message,
      },
    });
  }

  const members = evaluateAudience(validation.data);

  return res.json({
    name: validation.data.name,
    asOf: validation.data.asOf,
    total: members.length,
    members,
  });
});

export default router;