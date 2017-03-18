using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using E2ETek.ViewModels;
using System.Dynamic;

namespace E2ETek.Controllers
{
    public class HomeController : Controller
    {
        
        public ActionResult Index()
        {
            dynamic myModel = new ExpandoObject();
            var defectObjs = new List<DefectView>();
            var customers = new Customer().GetCustomers();
            myModel.Defects = GetDefects(customers);
            myModel.Customers = customers;
            return View(myModel);
        }

        public ActionResult AddUpdateDefect(Defect defect)
        {
            try
            {
                var customers = new Customer().GetCustomers();
                if (defect.DefectId == 0)
                    new Defect().Add(defect);
                else
                    new Defect().Update(defect);
                return Json(GetDefects(customers));
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

        public ActionResult GetDefect(int defectID)
        {
            Defect defect = new Defect();
            try
            {
                defect = new Defect().Get(defectID);
            }
            catch (Exception ex)
            {

            }
            return Json(defect);
        }

        #region[Private functions]
        private List<DefectView> GetDefects(List<Customer> customers)
        {
            var defectObjs = new List<DefectView>();
            var defects = new Defect().GetDefects();
            try
            {
                #region[Helpers]
                Func<int, string> fnGetPriorityName = (priorityID) =>
                {
                    Defect.DefectPriority priority = (Defect.DefectPriority)priorityID;
                    return priority.ToString();
                };
                Func<int, string> fnGetCustomerName = (customerID) =>
                {
                    var customer = customers.Where(c => c.CustomerID == customerID).FirstOrDefault();
                    return customer.CustomerName;
                };
                #endregion
                defects.ForEach(d => defectObjs.Add(new DefectView()
                {
                    DefectId = d.DefectId,
                    Customer = fnGetCustomerName(d.CustomerID),
                    Priority = fnGetPriorityName(d.Priority),
                    CreatedDate = d.CreatedDate.ToString("MM/dd/yyyy"),
                    description = d.description
                }));
                
            }
            catch(Exception ex)
            {

            }
            return defectObjs;
        }
        #endregion
    }
}