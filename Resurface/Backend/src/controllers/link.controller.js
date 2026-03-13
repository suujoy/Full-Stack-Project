import savedLinkModel from "../models/savedLink.model.js";
import { metaData } from "../utils/metadataFetcher.js";

export const createLinkController = async (req, res, next) => {
    try {
        const { url } = req.body;

        const meta = await metaData(url);

        const savedLink = await savedLinkModel.create({
            url,
            title: meta.title,
            description: meta.description,
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const links = await savedLinkModel
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await savedLinkModel.countDocuments();

        res.status(200).json({
            success: true,
            message: "Links fetched successfully",
            totalPages: Math.ceil(total / limit),
            totalLinks: total,
            page,
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

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Link deleted successfully",
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

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found",
            });
        }

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
            { $set: { url, title, description, tags } },
            { new: true },
        );

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Link updated successfully",
            link,
        });
    } catch (err) {
        next(err);
    }
};
