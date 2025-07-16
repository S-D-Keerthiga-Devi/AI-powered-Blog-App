import jwt from 'jsonwebtoken'

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // DEBUG: log environment and received values
        console.log("env email:", process.env.ADMIN_EMAIL);
        console.log("env password:", process.env.ADMIN_PASSWORD);
        console.log("received email:", email);
        console.log("received password:", password);

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
