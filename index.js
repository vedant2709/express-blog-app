const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog=require("./models/blog")
const PORT = 3000;
const cookieParser=require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.resolve("./public")))
app.use(checkForAuthenticationCookie("token"))

app.get("/", async (req, res) => {
  const allBlogs=await Blog.find({})
  return res.render("home",{
    user:req.user,
    blogs:allBlogs,
  });
});

app.use("/user/", userRoute);
app.use("/blog/", blogRoute);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
