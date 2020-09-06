using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers {
    [ServiceFilter (typeof (LogUserActivity))]
    [Authorize]
    [Route ("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly IMapper _mapper;
        private readonly IDatingRepository _repo;
        public UsersController (IDatingRepository repo, IMapper mapper) {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers ([FromQuery] UserParams userParams) {
            //Agarra el user del token 
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            //Devuelve la informacion del user logueado
            var userFromRepo = await _repo.GetUser (currentUserId);
            //El parametro de la clase UserParams es el userId
            userParams.UserId = currentUserId;

            //Si no se ha definido un genero como user parametro
            if (string.IsNullOrEmpty (userParams.Gender)) {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }

            var users = await _repo.GetUsers (userParams);

            var UsersToReturn = _mapper.Map<IEnumerable<UserForListDto>> (users);

            //Por ser un API tenemos acceso al response y por ende a los headers entonces podemos agregar la paginacion
            Response.AddPagination (users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok (UsersToReturn);
        }

        [HttpGet ("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser (int id) {
            var user = await _repo.GetUser (id);

            var UserToReturn = _mapper.Map<UserForDetailDto> (user);

            return Ok (UserToReturn);
        }

        [HttpPut ("{id}")]
        public async Task<IActionResult> UpdateUser (int id, UserForUpdateDto userForUpdateDto) {
            //User id del token == user id de la ruta
            if (id != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();

            var userFromRepo = await _repo.GetUser (id);

            _mapper.Map (userForUpdateDto, userFromRepo);

            if (await _repo.SaveAll ())
                return NoContent ();

            throw new Exception ($"Updating user {id} failed on save");
        }

        // LIKES
        [HttpPost ("{id}/like/{recipientId}")]
        public async Task<ActionResult> LikeUser (int id, int recipientId) {
            //User id del token == user id de la ruta
            if (id != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();

            var like = await _repo.GetLike (id, recipientId);

            if (like != null) {
                return BadRequest ("You already like this user");
            }

            if (await _repo.GetUser (recipientId) == null) {
                return NotFound ();
            }

            like = new Like {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like>(like);

            if (await _repo.SaveAll ()) {
                return Ok ();
            }

            return BadRequest ("Failed to like user");

        }

    }
}