import { Link } from "react-router-dom"

const Header = () => {
    return (
        <div className="header" >
            <h1 className='title'>
                <Link to={'/'}>BA</Link>
            </h1>
        </div>
    )
}

export default Header