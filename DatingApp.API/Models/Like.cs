namespace DatingApp.API.Models
{
    public class Like
    {
        // Esta clase va a utilizar FluentAPI

        public int LikerId {get; set;} //id del user que da like, va a ser una coleccion de la entidad User
        public int LikeeId {get;set;} // id del user al que le da like, va a ser una coleccion de la entidad User
        public User Liker { get; set; }
        public User Likee { get; set; }

    }
}