using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace E2ETek.ViewModels
{
    public class DefectView
    {
        public int DefectId { get; set; }
        public string Customer { get; set; }
        public string Priority { get; set; }
        public string CreatedDate { get; set; }
        public string description { get; set; }
    }
}