import { Router } from "express";
import {
    loginValidator,
    registerValidator,
} from "../validation/auth.validate.js";
import {
    fetchUsersController,
    getMeController,
    loginController,
    logoutController,
    registerController,
    searchUsersController,
} from "../controllers/auth.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @name registerController
 * @description register user
 * @route POST /api/auth/register
 * @access public
 */

authRouter.post("/register", registerValidator, registerController);

/**
 * @name loginController
 * @description login user
 * @route POST /api/auth/login
 * @access public
 */
authRouter.post("/login", loginValidator, loginController);

/**
 * @name identifyUser
 * @description identify user
 * @route GET /api/auth/get-me
 * @access private
 */

authRouter.get("/get-me", identifyUser, getMeController);

/**
 * @name fetchUsers
 * @description fetch all users
 * @route GET /api/auth/fetch-users
 * @access private
 */

authRouter.get("/fetch-users", identifyUser, fetchUsersController);

/**
 * @name logout
 * @description logout user
 * @route GET /api/auth/logout
 * @access private
 */

authRouter.get("/logout", identifyUser, logoutController);


/**
 * @name searchUsers
 * @description search users by name or username
 * @route GET /api/auth/search-users?query=
 * @access private
*/

authRouter.get("/search-users", identifyUser, searchUsersController);

export default authRouter;