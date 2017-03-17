using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace E2ETek
{
    public partial class Defect
    {
        E2ETekEntities DBEntity = new E2ETekEntities();
        public enum DefectPriority
        {
            High = 1,
            Medium = 2,
            Low = 3
        }
        public List<Defect> GetDefects()
        {
            try
            {
                return DBEntity.Defects.ToList();
            }
            catch (Exception ex)
            {

            }
            return new List<Defect>();
        }

        public Defect Add(Defect defect)
        {
            try
            {
                DBEntity.Defects.Add(defect);
                DBEntity.SaveChanges();
                return defect;
            }
            catch(Exception ex)
            {

            }
            return new Defect();
        }

        public Defect Update(Defect defect)
        {
            try
            {
                DBEntity.Defects.Attach(defect);
                DBEntity.SaveChanges();
            }
            catch(Exception ex)
            {

            }
            return defect;
        }

        public bool Delete(int defectID)
        {
            try
            {
                var defect = new Defect() { DefectId = defectID };
                DBEntity.Defects.Remove(defect);
                DBEntity.SaveChanges();
            }
            catch(Exception ex)
            {

            }
            return true;
        }

        public Defect Get(int defectID)
        {
            try
            {
                return DBEntity.Defects.Where(d => d.DefectId == defectID).FirstOrDefault();
            }
            catch(Exception ex)
            {

            }
            return new Defect();
        }
    }
}