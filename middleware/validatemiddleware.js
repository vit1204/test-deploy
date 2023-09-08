const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const connections = require("../databases/connection");
const { boolean } = require("joi");
const SECRET = process.env.JWT_SECRET;

dotenv.config();

const validateRegisterRequest = (req, res, next) => {
  const { name, age, gender, username, password, confirmPassword, email } =
    req.body;

  if (
    !name || !age || !gender || !email || !username || !password ||
    !confirmPassword
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (username.length < 3) {
    return res.status(400).json({
      Error:
        "Username must be over 3 charester and must be not include the special charesters",
    });
  }
  if (password !== confirmPassword || password.length < 3) {
    return res.status(400).json({ message: "Password don't match" });
  }
  if (typeof name !== "string" && name.length < 3) {
    return res.status(400).json({
      Error: "Name must be aleast over 3 charesters and must be a string",
    });
  }
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (typeof age !== "number" || age < 0) {
    return res.status(400).json({ message: "age must be a number above 0" });
  }

  return next();
};

const validateSearch = (req, res, next) => {
  const { page, limit, search } = req.query;
  if (page < 0) {
    return res.status(400).json({
      Error: "page number must be a positive number",
    });
  }
  if (limit < 0 || limit > 15) {
    return res.status(400).json({ error: "page must be limit from 1 to 14" });
  }
  return next();
};

// const validateAdmin = (req, res, next) => {
//   connections.query("SELECT * FROM users WHERE admin_id = ? ", [admin_id]);
//   const token = req.headers.authorization.split(" ")[1];
//   const isAdmin = jwt.verify(token, SECRET);

//   if (isAdmin) {
//     // Nếu user là admin, gọi hàm next để tiếp tục xử lý request
//     next();
//   } else {
//     // Nếu user không phải là admin, trả về lỗi "Unauthorized"
//     res.status(401).json({ error: "Unauthorized" });
//   }
// };

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(400).json({
        message: "Don't have token in header!",
      });
    }
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.status(400).json({
          message: "Unauthorized!",
        });
      }

      req.payload = payload;
      next();
    });
  } catch (error) {
    next(error);
  }
};
// const verifyTokenAndAuthorization = async (req, res, next)=>{
//     await verifyToken(req, res, () =>{
//         if(req.user.id === parseInt( req.params.id)){
//             next()
//         }
//         else{
//             return res.status(403).json('You are not allowed!')
//         }
//     })
// }

module.exports = {
  validateSearch,
  // validateAdmin,
  validateRegisterRequest,
  verifyToken,
  // verifyTokenAndAuthorization
};
