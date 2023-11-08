import TellerService from "../services/TellerService.js"


export const login = async (req, res) => {
    const dbClient = await TellerService.connect();

    const { login_id, password } = req.body;

    try {
        const data = await TellerService.login(dbClient, login_id, password);

        const { login_id: loginID, first_name, last_name, email, accessToken, message } = data;

        res.status(200).json({
            success: true,
            loginID,
            firstName: first_name,
            lastName: last_name,
            email,
            accessToken,
            message,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }

}
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
                login_id: response.login_id
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
}