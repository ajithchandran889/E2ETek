using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace E2ETek.Controllers
{
    public class HomeController : Controller
    {
        
        public ActionResult Index()
        {
            var defects = new Defect().GetDefects();
            return View(defects);
        }

        public ActionResult AddUpdateDefect(string defect)
        {
            try
            {
                var defectObj = new JavaScriptSerializer().Deserialize<Defect>(defect);
                if (defectObj.DefectId == 0)
                    defectObj = new Defect().Add(defectObj);
                else
                    defectObj = new Defect().Update(defectObj);
                return Json(defectObj);
            }
            catch(Exception ex)
            {

            }
            return Json(new { });
        }

        public ActionResult DeleteDefect(int defectID)
        {
            try
            {
                new Defect().Delete(defectID);
            }
            catch(Exception ex)
            {

            }
            return Json("");
        }
    }
}