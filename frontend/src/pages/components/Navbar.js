import { useNavigate } from "react-router-dom";
import styles from "../../styles/NavBar.module.css";
import Nav from 'react-bootstrap/Nav';
import { Navbar } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

import { useUser } from "../auth/UserContext";


const NavigationBar = () => {
    const navigate = useNavigate();
    const { user, logOut } = useUser();

    const handleSignOut = () => {
        logOut();

        navigate('/'); 
    };


    return (
        <div>
            <Navbar className={styles.Navbar} bg="red" expand="lg">
                 <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user ? (
                        <>
                          {/* <Nav.Item>
                            <span className="navbar-text">Hej, {user.username}!</span>
                          </Nav.Item> */}
                          <Nav.Item>
                            <Nav.Link onClick={handleSignOut}>Logga ut</Nav.Link>
                          </Nav.Item>
                        </>


                    ) : (
                    <>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/Registrera">Registrera</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/login">Logga in</Nav.Link>
                    </Nav.Item>
                    </>
                    )}
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default NavigationBar;