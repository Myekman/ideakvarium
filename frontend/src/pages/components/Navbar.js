import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/NavBar.module.css";
// import { Button } from "react-bootstrap";

const Navbar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Om backend kräver en utloggningsförfrågan, skicka den här
        // axios.post("/dj-rest-auth/logout/", ...)

        // Ta bort JWT från lokal lagring
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.log('Access token:', localStorage.getItem('access_token')); // bör vara null
        console.log('Refresh token:', localStorage.getItem('refresh_token')); // bör vara null

        navigate('/'); 
    };


    return (
        <div className={styles.Navbar}>
            <Link to='/register'>
                <p>Register</p>
            </Link>
            <Link to='/login'>
                <p>login</p>
            </Link>
            {/* <Button variant="secondary" onClick={handleSignOut}>
                <p>logout</p>
            </Button> */}
        </div>
    )
}

export default Navbar;