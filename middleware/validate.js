export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    
    console.log("✅ Valid body:", req.body);
    next();
  } catch (error) {
    console.error("❌ Validation Error:", error.issues);
    return res.status(400).json({ errors: error.issues });
  }
};
