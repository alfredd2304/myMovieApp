const {Schema, model} = require("mongoose");
const {compare, genSalt, hash} = require("bcrypt");
const mongoose = require("mongoose");
const Movie = require("./myMovieList");
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Debe ingresar correo electronico"]
    },
    name: {
        type: String,
        required: [true, "Debe ingresar correo electronico"]
    },
    nickname: {
        type: String,
        unique: true,
        required: [true, "Debe ingresar un nickname"]
        },
    birthdate: {
        type: Date,
        required: [true, "Debe ingresar fecha de nacimiento"]
        },
    password: {
        type: String,
        required: [true, "Debe ingresar una contraseña"]
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      }],
    list:{
        type: String,
        required: [true, "Asegurese de ingresar el nombre de su lista"]
    },
    rating:{
        type: Number,
        default: 0
    },
    ratings:[
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          rating: {
            type: Number,
            required: true,
          },
        },
      ],

},
{
    timestamps: {createdAt: "creationDate", updatedAt: "lastUpdate"}
});

userSchema.pre("save", async function(next){
    //si el password no se modifica no haremos nada
    if (!this.isModified("password")) return next();
    
    const salt = await genSalt(+process.env.SALTING_ROUNDS);
    this.password = await hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (plainText) {
    return await compare(plainText, this.password);
}

const User = model("User", userSchema);
module.exports = User;



