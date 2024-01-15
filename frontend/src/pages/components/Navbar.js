import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <Link to='/register'>
                <p>Register</p>
            </Link>
            <Link to='/login'>
                <p>login</p>
            </Link>
        </div>
    )
}

export default Navbar;