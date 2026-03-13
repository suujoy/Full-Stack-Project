import savedLinkModel from "../models/savedLink.model.js";

export const createLinkController = async (req, res, next) => {
    try {
        const { url, title, description, tags } = req.body;

        const savedLink = await savedLinkModel.create({
            url,
            title,
        });

        res.status(201).json({
            success: true,
            message: "Link created successfully",
            savedLink,
        });
    } catch (err) {
        next(err);
    }
};
/**
 * @name getLinksController
 * @route GET /api/link
 * @access public
 * @description get all links
 */
export const getLinksController = async (req, res, next) => {
    try {
        const links = await savedLinkModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Links fetched successfully",
            links,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name deleteLinkController
 * @route DELETE /api/link/:id
 * @access public
 * @description delete a link
 */

export const deleteLinkController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const link = await savedLinkModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Link deleted successfully",
            link,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name detailsLinkController
 * @route GET /api/link/:id
 * @access public
 * @description get details of a link
 */

export const detailsLinkController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const link = await savedLinkModel.findById(id);

        res.status(200).json({
            success: true,
            message: "Link details fetched successfully",
            link,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name updateLinkController
 * @route PUT /api/link/:id
 * @access public
 * @description update a link
 */

export const updateLinkController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { url, title, description, tags } = req.body;

        const link = await savedLinkModel.findByIdAndUpdate(
            id,
            { url, title, description, tags },
            { new: true },
        );

        res.status(200).json({
            success: true,
            message: "Link updated successfully",
            link,
        });
    } catch (err) {
        next(err);
    }
};
