import {  DataTypes, Sequelize, STRING } from "sequelize"

module.exports = (sequelize : Sequelize, dataTypes : typeof DataTypes) => {

    const concatRequiredMessage = (data : string) => {
        return `${data} is required`
    }

    return sequelize.define('User', {

        id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, 
        },
        username: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Username')},
                notEmpty : { msg : concatRequiredMessage('Username')}
            }
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false,
            unique: true,
            validate : {
                isEmail:true, 
                notNull: { msg : concatRequiredMessage('Email')},
                notEmpty: { msg : concatRequiredMessage('Email')}
            }
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Password')},
                notEmpty : { msg : concatRequiredMessage('Password')}
            }
        },
        firstname: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Firstname')},
                notEmpty : { msg : concatRequiredMessage('Firstname')}
            }
        },
        lastname: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Lastname')},
                notEmpty : { msg : concatRequiredMessage('Lastname')}
            }
        },
        date_of_birth: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Date of birth')},
                notEmpty : { msg : concatRequiredMessage('Date of birth')}
            }
        },
        biography: {
            type: dataTypes.STRING,
            allowNull: true
        },
        profile_picture: {
            type: dataTypes.STRING,
            // validate : {
            //     isUrl:true
            // }
        }, 
    })
}
