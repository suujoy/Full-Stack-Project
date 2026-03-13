import { Router } from "express";
import { createLinkValidator } from "../validation/link.validate.js";
import {
    createLinkController,
    deleteLinkController,
    detailsLinkController,
    getLinksController,
    updateLinkController,
} from "../controllers/link.controller.js";

const linkRouter = Router();

/**
 * @name createLink
 * @route POST /api/link/create
 * @access public
 * @description create a new link
 * @body {url, title, description, tags}
 */
linkRouter.post("/", createLinkValidator, createLinkController);

/**
 * @name getLinks
 * @route GET /api/link
 * @access public
 * @description get all links
 */
linkRouter.get("/", getLinksController);

/**
 * @name deleteLink
 * @route DELETE /api/link/:id
 * @access public
 * @description delete a link
 */
linkRouter.delete("/:id", deleteLinkController);

/**
 * @name updateLink
 * @route PATCH /api/link/:id
 * @access public
 * @description update a link
 */
linkRouter.patch("/:id", createLinkValidator, updateLinkController);

/**
 * @name detailsLink
 * @route GET /api/link/:id
 * @access public
 * @description get details of a link
 */
linkRouter.get("/:id", detailsLinkController);

export default linkRouter;
