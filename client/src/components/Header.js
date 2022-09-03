import { Link, useLocation } from "react-router-dom"
import HeaderSearch from "./HeaderSearch";

const Header = () => {
    const location = useLocation();

    return (
        <div className="header" >
            <h1 className='title'>
                <Link to={'/'}>BA</Link>
            </h1>
            {location.pathname === '/' &&
                <>
                    <HeaderSearch />
                    <Link className="client-add" to={'/create-client'}>Add Client</Link>
                </>
            }
        </div>
    )
}

export default Header