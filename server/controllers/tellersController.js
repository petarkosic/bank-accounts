import TellerService from "../services/TellerService.js"


export const login = async () => { }
export const logout = async () => { }

export const createNewTeller = async (req, res) => {
    const dbClient = await TellerService.connect();

    try {
        const response = await TellerService.createTeller(dbClient, req.body);

        if (response.error) {
            res.status(400).json({
                success: false,
                error: response.error
            });
        } else {
            res.status(200).json({
                success: true,
                message: response.message,
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
}