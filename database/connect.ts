import { DataTypes } from "sequelize"
import { tokenTypes } from "../types/token"
import { userTypes } from "../types/user"
let users = require('../database/mock-user')
let tokens = require('../database/mock-token')
const { Sequelize } = require('sequelize')
const UserModel = require('../models/users')
const TokenModel = require('../models/tokens')

const sequelize = new Sequelize (
    'TheChoiceIsYoursSequelize',
    'postgres',
    'postgres',
    {
        host:'localhost',
        dialect:'postgres',
        port: 5432,
        dialectOptions: {
            useUTC: false,
            dateStrings: true,
            typeCast: true
      },
      timezone: '+02:00'
    }
)

sequelize.authenticate()
    .then(() => console.log('Link established'))
    .catch((error : Error) => console.error(`Error: ${error}`)
    )

const User = UserModel(sequelize, DataTypes)
const Token = TokenModel(sequelize, DataTypes)

const initDb = () => {

        // User.hasOne(Token, {as: 'user'})
        // Token.belongsTo(User)

        return sequelize.sync({force: true}).then(()=> {
            users.map((user: userTypes) => {
                User.create({
                    username: user.username,
                    password: user.password,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    date_of_birth: user.date_of_birth,
                    email: user.email,
                    biography: user.biography,
                    profile_picture: user.profile_picture,
                }).then((response: { toJSON: () => string }) => console.log(response.toJSON()))
            })
            tokens.map((token: tokenTypes) => {
                Token.create({
                    refreshToken: token.refreshToken,
                    username: token.username,
                    userId: token.userId
                }).then((response: { toJSON: () => string }) => console.log(response.toJSON()))
            })

            console.log('Database created')
    })
}

module.exports = {
    initDb, 
    User,
    Token
}