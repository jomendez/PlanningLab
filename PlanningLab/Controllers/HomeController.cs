using PlanningLab.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlanningLab.Controllers
{
    public class HomeController : Controller
    {
        [Authorize]
        public ActionResult Index()
        {
            PlanningLabCtx ctx = new PlanningLabCtx();
            var aux = ctx.UserRooms.ToList();
            return View();
        }
    }
}