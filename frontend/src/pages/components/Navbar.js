// import { useNavigate } from "react-router-dom";
import styles from "../../styles/NavBar.module.css";
import Nav from 'react-bootstrap/Nav';
import { Navbar } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

// import { useUser } from "../auth/UserContext";


const NavigationBar = () => {
    // const navigate = useNavigate();
    // const { user, logOut } = useUser();

    // const handleSignOut = () => {
    //     logOut();

    //     navigate('/'); 
    // };


    return (
        <div>
            <Navbar expand="lg">
                 {/* <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles.Navbar}/> */}
                {/* <Navbar.Collapse id="basic-navbar-nav"> */}
                {/* <div className={styles.navbarcollapse}> */}
                <Nav className={styles.customNavbar}>
                        <Nav.Item className="me-3">
                            <Nav.Link as={NavLink} to="/fiskar/create" className={styles.customnavlink}>Skapa fisk</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                            <Nav.Link as={NavLink} to="/fiskar/lista" className={styles.customnavlink}>Fisklista</Nav.Link>
                        </Nav.Item> */}
                </Nav>
                    {/* {user ? (
                        <>
                          <Nav.Item>
                            <Nav.Link className={styles.customnavlink} onClick={handleSignOut}>Logga ut</Nav.Link>
                          </Nav.Item>
                        </>


                    ) : (
                    <>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/register" className={styles.customnavlink}>Registrera</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/login" className={styles.customnavlink}>Logga in</Nav.Link>
                    </Nav.Item>
                    </>
                    )} */}
                
                {/* </div>
                </Navbar.Collapse> */}
            </Navbar>
        </div>
    )
}

export default NavigationBar;