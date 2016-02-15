using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PlanningLab.Models;
using System.Web.Security;

namespace PlanningLab.Controllers
{
    [RoutePrefix("api/dashboard")]
    public class DashboardController : ApiController
    {
        public PlanningLabCtx ctx = new PlanningLabCtx();

        // GET api/<controller>
        [HttpGet]
        [Route("userinfo")]
        public UserInfo userInfo()
        {
             var Email = User.Identity.Name;
            
            var ret = ctx.AspNetUsers.FirstOrDefault(u => u.Email == Email);
            UserInfo userInfo = new UserInfo();
            if (ret != null)
            {
                userInfo.Name = ret.Name;
                userInfo.Email = ret.Email;
            }

            return userInfo;
        }

        // GET api/<controller>/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/<controller>
        public bool Post([FromBody]string room)
        {
            var Email = User.Identity.Name;
            var user = ctx.AspNetUsers.FirstOrDefault(u => u.Email == Email);
            if (user == null)
            {
                throw new Exception("User doesn't exist");
            }

            if (ctx.UserRooms.Any(r => r.RoomName == room))
            {
                throw new Exception("The room you attempt to create already exist");
            }

            var ur = new UserRooms();
            ur.RoomId = Guid.NewGuid();
            ur.RoomName = room;
            ur.UserId = Email;
            ctx.UserRooms.Add(ur);
            ctx.SaveChanges();
            return true;
        }

        [HttpGet]
        [Route("isowner")]
        public bool IsOwner(string roomName)
        {
            var Email = User.Identity.Name;
            var ret = ctx.UserRooms.Any(r => r.RoomName == roomName && r.UserId == Email);
            return ret;
        }

        [HttpGet]
        [Route("myrooms")]
        public List<UserRooms> MyRooms()
        {
            var Email = User.Identity.Name;
            return ctx.UserRooms.Where(r => r.UserId == Email).ToList();
        }
        
        [HttpGet]
        [Route("getRoomFromId")]
        public string RoomFromId(string id)
        {
            //var Email = User.Identity.Name;
            var ret = ctx.UserRooms.FirstOrDefault(r => r.RoomId == new Guid(id));
            return ret != null ? ret.RoomName : "";
        }


        [HttpGet]
        [Route("getRoomFromName")]
        public Guid RoomFromName(string name)
        {
            //var Email = User.Identity.Name;
            var ret = ctx.UserRooms.FirstOrDefault(r => r.RoomName == name);
            return ret != null ? ret.RoomId : new Guid();
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}