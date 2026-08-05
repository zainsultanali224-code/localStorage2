const paginate = async (Model, req, searchFields = ["title"]) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 5, 100);

    const allowedSort = [
        "createdAt",
        "-createdAt",
        "title",
        "-title",
        "email",
        "-email",
    ];

    const sort = allowedSort.includes(req.query.sort)
        ? req.query.sort
        : "-createdAt";

    const escapeRegex = (text) =>
        text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const search = escapeRegex((req.query.search || "").trim());

    let filter = {};

    if (search) {
        filter.$or = searchFields.map((field) => ({
            [field]: {
                $regex: search,
                $options: "i",
            },
        }));
    }

    return Model.paginate(filter, {
        page,
        limit,
        sort,
    });
};

export default paginate;