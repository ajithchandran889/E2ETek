using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace E2ETek
{
    public partial class Customer
    {
        E2ETekEntities DBEntity = new E2ETekEntities();

        public List<Customer> GetCustomers()
        {
            try
            {
                return DBEntity.Customers.ToList();
            }
            catch(Exception ex)
            {

            }
            return new List<Customer>();
        }
    }
}