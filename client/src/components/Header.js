import { Link, useLocation } from "react-router-dom"

const Header = () => {
    const location = useLocation();

    return (
        <div className="header" >
            <h1 className='title'>
                <Link to={'/'}>BA</Link>
            </h1>
            {location.pathname === '/' &&
                <>
                    <input
                        type="text"
                        placeholder="Search by account number"
                        className="search"
                    />
                    <button className="client-add">Add Client</button>
                </>
            }
        </div>
    )
}

export default Header