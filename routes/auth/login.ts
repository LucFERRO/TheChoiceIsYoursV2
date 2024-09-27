import { Application } from "express";
import { ValidationError } from "sequelize";
import { ApiException } from "../../types/exception";
import { userTypes } from "../../types/user";
import { tokenTypes } from "../../types/token";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, Token } = require("../../database/connect");

/**
 * @swagger
 * tags:
 *      name: Authentification
 *      description: Manage authentification
 */

/**
 * @openapi
 * /api/auth/login:
 *  post:
 *      tags: [Authentification]
 *      description: Login
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: JSON
 *         in: body
 *         required: true
 *         type: object
 *         default: {"username": "string", "password": "string"}
 *      responses:
 *        200:
 *          description: Login. Returns tokens if successful login.
 */
module.exports = (app: Application) => {
    app.post("/api/auth/login", (req, res) => {
        User.findAll().then(async (users: any) => {
            const user = users.find(
                (user: userTypes) => user.username == req.body.username
            );
            let message: string = "";

            if (user == null) {
                message = "No such username exists.";
                return res
                    .status(400)
                    .json({ userFound: false, message: message });
            }
            if (!await bcrypt.compare(req.body.password, user.password)) {
                message = "Wrong password for this username.";
                return res
                    .status(401)
                    .json({ successfullLogin: false, message: message });
            } else {
                message = "Good";
                const accessToken = jwt.sign(
                    { name: user.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "15s" }
                );
                const refreshToken = jwt.sign(
                    { name: user.username },
                    process.env.REFRESH_TOKEN_SECRET
                );

                Token.findOne({ where: { username: user.username } }).then(
                    (token: tokenTypes) => {
                        if (token !== null) {
                            // Token.destroy({where: { username: user.username },})
                            Token.destroy({where: { userId: user.id },})
                            // .then(() => {
                                // const message = `Token successfully DELETED.`;
                                // res.json({message, data: token })
                                // return res
                                //     .status(200)
                                //     .json({
                                //         successfullLogin: true,
                                //         userId: user.id,
                                //         accessToken: accessToken,
                                //         refreshToken: refreshToken,
                                //     });
                            // });
                            // const message = "Requested token does not exist.";
                            // return res.status(404).json({ message });
                        }

                        Token.create({
                            refreshToken : refreshToken,
                            username : user.username,
                            userId : user.id
                        }).then((token: tokenTypes) => {
                            const message: string = `Refresh token successfully replaced.`;
                            // res.json({ message, data: token });
                            return res
                            .status(200)
                            .json({
                                successfullLogin: true,
                                userId: user.id,
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                message: message,
                                oldToken: token,
                            });
                        })
                        // A VOIR ?

                        // //   User.update({
                        // //     tokenId : truc
                        // // }, {
                        // //   where: { id: user.id },
                        // // })

                        // //TEJ LE VIEUX
                        // //REMPLACER PAR NOUVEAU TOKEN REFRESH
                        // // })
                        // // .catch((error : ApiException ) => {
                        // //   const message = "Cannot find token."
                        // //   res.status(500).json({message, data: error})
                        // // })
                        // return res.status(200).json({ successfullLogin : true, userId : user.id , accessToken : accessToken, refreshToken : refreshToken })
                        // })
                        // .catch((error : ApiException) => {
                        //         const message = `Could not get users list.`
                        //         res.status(500).json({message : message, data : error})
                        //     });
                    }
                );
            }
        });
    });
};
