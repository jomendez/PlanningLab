using System;
using System.ComponentModel.DataAnnotations;

namespace PlanningLab.Models
{
    public class UserRooms
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public Guid RoomId { get; set; }
        public string RoomName { get; set; }
    }
}