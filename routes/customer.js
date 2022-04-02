var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Customer page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM customer",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("customer/list", {
          title: "Data customer",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var customer = {
        id: req.params.id,
      };

      var delete_sql = "delete from customer where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          customer,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/customer");
            } else {
              req.flash("msg_info", "Delete Data customer Success");
              res.redirect("/customer");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM customer where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/customer");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "customer tidak ditemukan!");
              res.redirect("/customer");
            } else {
              console.log(rows);
              res.render("customer/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama_customer", "Harap isi Nama!").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama_customer = req.sanitize("nama_customer").escape().trim();
      v_kode_gitar = req.sanitize("kode_gitar").escape().trim();
      v_tanggal_sewa = req.sanitize("tanggal_sewa").escape().trim();
      v_tanggal_kembali = req.sanitize("tanggal_kembali").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();

      var customer = {
        nama_customer: v_nama_customer,
        kode_gitar: v_kode_gitar,
        tanggal_sewa: v_tanggal_sewa,
        tanggal_kembali: v_tanggal_kembali,
        harga: v_harga,
      };

      var update_sql = "update customer SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          customer,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("customer/edit", {
                nama_customer: req.param("nama_customer"),
                kode_gitar: req.param("kode_gitar"),
                tanggal_sewa: req.param("tanggal_sewa"),
                tanggal_kembali: req.param("tanggal_kembali"),
                harga: req.param("harga"),
              });
            } else {
              req.flash("msg_info", "Update data customer success");
              res.redirect("/customer/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/customer/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama_customer", "Harap isi Nama!").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama_customer = req.sanitize("nama_customer").escape().trim();
    v_kode_gitar = req.sanitize("kode_gitar").escape().trim();
    v_tanggal_sewa = req.sanitize("tanggal_sewa").escape().trim();
    v_tanggal_kembali = req.sanitize("tanggal_kembali").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();

    var customer = {
      nama_customer: v_nama_customer,
      kode_gitar: v_kode_gitar,
      tanggal_sewa: v_tanggal_sewa,
      tanggal_kembali: v_tanggal_kembali,
      harga: v_harga,
    };

    var insert_sql = "INSERT INTO customer SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        customer,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("customer/add-customer", {
              nama_customer: req.param("nama_customer"),
              kode_gitar: req.param("kode_gitar"),
              tanggal_sewa: req.param("tanggal_sewa"),
              tanggal_kembali: req.param("tanggal_kembali"),
              harga: req.param("harga"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Data customer berhasil ditambahkan!");
            res.redirect("/customer");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("customer/add-customer", {
      nama_customer: req.param("nama_customer"),
      harga: req.param("harga"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("customer/add-customer", {
    title: "Tambahkan customer",
    nama_customer: "",
    kode_gitar: "",
    tanggal_sewa: "",
    tanggal_kembali: "",
    harga: "",
    session_store: req.session,
  });
});

module.exports = router;