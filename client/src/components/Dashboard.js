import React from 'react'
import { useNavigate } from 'react-router-dom';
// TODO: show number of VIP customers grouped by country
// TODO: show customers that are about to reach credit card limit (10% buffer left)
const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-wrapper">
            <div className="buttons">
                <button className="button-go-back" onClick={() => navigate(-1)}>Go Back</button>
            </div>

            <div>Number of premium customers by country</div>
            <div>Customers about to reach credit card limit</div>
        </div>
    )
}

export default Dashboard;