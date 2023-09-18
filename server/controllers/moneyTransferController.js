import MoneyTransferService from "../services/MoneyTransferService.js";

export const depositOrWithdraw = async (req, res) => {
    const dbClient = await MoneyTransferService.connect();

    const { client_id, deposited_amount } = req.body;

    try {
        await MoneyTransferService.depositOrWithdraw(dbClient, deposited_amount, client_id)

        res.status(200).json({
            message: 'Client balance updated',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
}

export const sendMoney = async (req, res) => {
    const dbClient = await MoneyTransferService.connect();

    const { from, to, amount } = req.body;

    try {
        await MoneyTransferService.sendMoney(dbClient, from, to, amount);

        res.status(200).json({
            success: true,
            message: 'Accounts Updated',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
}