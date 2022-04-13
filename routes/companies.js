const express = require("express");
const router=new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")


/** GET / - returns `{companies: [{code, name},{code, name}...]}`*/

router.get("/", async function(req, res, next) {
    try {
      const companiesQuery = await db.query("SELECT code, name FROM companies")
      return res.json({ companies: companiesQuery.rows});
    } catch(err){
      return next(err)
    }
  });

/** GET /[code] - return data about one company: `{company: company}` */

router.get("/:code", async function(req, res, next) {
    try {
      const companyQuery = await db.query(
        "SELECT code, name FROM companies WHERE code = $1", [req.params.code]);
  
      if (companyQuery.rows.length === 0) {
        let notFoundError = new Error(`There is no company with code of '${req.params.code}`);
        notFoundError.status = 404;
        throw notFoundError;
      }
      return res.json({ company: companyQuery.rows[0] });
    } catch (err) {
      return next(err);
    }
  });


/** POST / - create company from input data; return `{company: company}` */

router.post("/", async function(req, res, next) {
    try {
      const result = await db.query(
        `INSERT INTO companies (code, name) 
           VALUES ($1,$2) 
           RETURNING code,name`,
        [req.body.code, req.body.name]);
  
      return res.status(201).json({company: result.rows[0]});  // 201 CREATED
    } catch (err) {
      return next(err);
    }
  });



/** PATCH /[code] - update fields in company; return `{company: company}` */

router.patch("/:code", async function(req, res, next) {
    try {
      if ("code" in req.body) {
        throw new ExpressError("Not allowed", 400)
      }
  
      const result = await db.query(
        `UPDATE companies 
             SET name=$1, description=$2
             WHERE code = $3
             RETURNING code, name, description`,
        [req.body.name, req.body.description,req.params.code]);
  
      if (result.rows.length === 0) {
        throw new ExpressError(`There is no company with code of '${req.params.code}`, 404);
      }
  
      return res.json({ company: result.rows[0]});
    } catch (err) {
      return next(err);
    }
  });



/** DELETE /[code] - delete company, return `{message: "Company deleted"}` */

router.delete("/:code", async function(req, res, next) {
    try {
      const result = await db.query(
        "DELETE FROM companies WHERE code = $1 RETURNING code", [req.params.code]);
  
      if (result.rows.length === 0) {
        throw new ExpressError(`There is no company with code of '${req.params.code}`, 404);
      }
      return res.json({ status: "deleted" });
    } catch (err) {
      return next(err);
    }
  });
  

  
module.exports = router;