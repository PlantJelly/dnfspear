const express = require("express");

const app = express();

require("dotenv").config();

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.send("Hello, Express");
});

// testController 불러오기
const testController = require("./src/controllers/testController.js");

// 테스트용 라우트 추가
app.get("/test", testController.test);

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
