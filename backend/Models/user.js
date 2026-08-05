const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

userSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("User", userSchema)
