const express = require("express");
const { Op } = require("sequelize");
const { auth, authLogin } = require("../../Midder_ware/Auth");
const Nguoi_dung = require("../../models/Nguoi_dung");
const Router = express.Router();
const base64 = require("js-base64");
const { v4: uuidv4 } = require("uuid");
const Token = require("../../models/Token");
var fs = require("fs");
var md5 = require("md5");
Router.post("/", async (req, res) => {
  const check_email_login_user = await Nguoi_dung.findAll({
    where: {
      email: req.body.email,
    },
  });
  var string_token = "";
  console.log(check_email_login_user);

  if (check_email_login_user == "") {
    const result = await Nguoi_dung.create({
      id_quyen: req.body.id_quyen,
      ho_ten: req.body.ho_ten,
      ten_dang_nhap: req.body.ten_dang_nhap,
      mat_khau: md5(req.body.mat_khau),
      email: req.body.email,
      ngay_tao: new Date(),
      lan_dang_nhap_cuoi: new Date(),
      trang_thai: req.body.trang_thai,
    });

    const expireted_date = new Date(
      new Date().getTime() + 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split(".")[0]
      .replace(/T/, " ");
    const created_date = new Date()
      .toISOString()
      .split(".")[0]
      .replace(/T/, " ");

    string_token = base64.encode(
      result.email + " " + expireted_date + " " + uuidv4()
    );
    const result_token = await Token.create({
      user_id: result.id,
      created_date: new Date(),
      expireted_date: expireted_date,
      type_token: 4,
      token: string_token,
    });

    res.status(200).json({
      message: "create a new user sucessfull",
      data: result,
      token: result_token,
      error: false,
    });
  } else {
    res.status(202).json({
      message: "This email is already in used  ",
      error: false,
    });
  }
});

Router.post("/login", async (req, res) => {
  if (req.body.email != "" && req.body.mat_khau != "") {
    const result = await Nguoi_dung.findOne({
      where: {
        [Op.and]: [
          { email: req.body.email },
          {
            mat_khau: md5(req.body.mat_khau),
          },
        ],
      },
    });
    const result_token = await Token.findOne({
      where: {
        user_id: result.id,
      },
    });
    if (result != null && result_token != null) {
      res.json({
        message: "Đăng nhập thành công.",
        data: result,
        token: result_token,
        error: false,
      });
    } else {
      res.json({
        message: "Tài khoản chưa được đăng ký",
        error: true,
      });
    }
  } else {
    res.json({
      message: "Vui lòng kiểm tra lại thông tin",
      error: true,
    });
  }
});

Router.post("/auth", async (req, res) => {
  const auth = req.header("Authorization").split(" ")[1];
  const data_string_auth = Buffer.from(auth, "base64").toString("utf-8");
  const ngay_het_han = new Date(data_string_auth.split(" ")[1]);
  const token = data_string_auth.split(" ")[0];
  if (ngay_het_han > new Date()) {
    const result_check_token = await Token.findOne({
      where: {
        token: auth,
      },
    });
    if (result_check_token != null) {
      const resul_info =await Nguoi_dung.findOne({
        where:{
          id: result_check_token.user_id,
         }
      });
      res.json({
        message: "Dang nhap thanh cong",
        data: resul_info,
        token: result_check_token,
        error: false,
      });
    }
  }
  // const result = await Token.findOne({
  //   token
  // })
});
module.exports = Router;
// console.log("taotoken");
// const auth = req.header("Authorization");
// if (typeof auth != "undefined" && auth != "" && auth != null) {
//   const Auth = auth.split(" ")[1];
//   const data_string_auth = Buffer.from(Auth, "base64").toString();

//   const email = data_string_auth.split(" ")[0];
//   const password = data_string_auth.split(" ")[1];
//   const date_curr = new Date().toISOString().split("T")[0];

//   const result = await Nguoi_dung.findAll({
//     where: {
//       [Op.and]: [
//         { email: req.body.email },
//         {
//           mat_khau: req.body.mat_khau,
//         },
//       ],
//     },
//   });
//   if (result.length > 0) {
//     res.json({
//       message: "tao token thanh cong",
//       data: result,
//       error: false,
//     });
//   }

//   // const result_check_token = Token.findAll({
//   //     where:{
//   //         [Op.and]:[
//   //             {token:Auth},
//   //             {expireted_date:{
//   //                 [Op.gte]:date_curr
//   //             }}
//   //         ]
//   //     }
//   // })

//   // if(result_check_token != ""){
//   //     console.log(result_check_token)
//   // }
// } else {
//   const result = await Nguoi_dung.findAll({
//     where: {
//       [Op.and]: [
//         { email: req.body.email },
//         {
//           mat_khau: req.body.mat_khau,
//         },
//       ],
//     },
//   });

//   const expireted_date = new Date(
//     new Date().getTime() + 30 * 24 * 60 * 60 * 1000
//   )
//     .toISOString()
//     .split(".")[0]
//     .replace(/T/, " ");
//   const created_date = new Date()
//     .toISOString()
//     .split(".")[0]
//     .replace(/T/, " ");

//   string_token = base64.encode(
//     result.email +
//       " " +
//       result.mat_khau +
//       " " +
//       expireted_date +
//       " " +
//       uuidv4()
//   );

//   if (result != "") {
//     const result_token = await Token.findAll({
//       where: {
//         user_id: result[0].id,
//       },
//     });
//     if (result_token != "") {
//       res.json({
//         message: "tao token thanh cong",
//         data: result_token,
//         error: false,
//       });
//     } else {
//       const result_token = await Token.create({
//         user_id: result.id,
//         created_date: new Date(),
//         expireted_date: expireted_date,
//         type_token: 4,
//         token: string_token,
//       });
//       result.json({
//         message: "tao token thanh cong",
//         data: result_token,
//         error: false,
//       });
//     }
//   }else{
//       res.json({
//           message: "Tai khoan nay khong ton tai",

//           error: true,
//         });
//   }
// }
