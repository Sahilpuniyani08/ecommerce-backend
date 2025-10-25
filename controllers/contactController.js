import Contact from "../models/Contact.js";



export const createContactQuery = async (req, res) => {

    try {
        const { name, email, query } = req.body;
        console.log(name, email, query)
        if (!name || !email || !query) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        await Contact.create({ name, email, query })
        res.json({ success: true, message: "Data received successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}