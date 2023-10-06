import { Link, useLocation } from "react-router-dom"
import Search from "./Search";

const Header = () => {
    const location = useLocation();

    return (
        <div className="header" >
            <h1 className='title'>
                <Link to={'/'}>BA</Link>
            </h1>

            {location.pathname === '/' &&
                <>
                    <div className="dashboard-link">
                        <Link to={'/dashboard'}><span>View Dashboard</span></Link>
                    </div>
                    <Search />
                    <Link className="client-add" to={'/create-client'}>Add Client</Link>
                </>
            }
        </div>
    )
}

export default Header