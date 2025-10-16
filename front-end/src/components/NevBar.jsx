import imgLogin from "../img/img-login2.png"
import {Link} from 'react-router-dom'
export default function Navbar () {
    return (
        <div>
            <div className="navbar">
                <div className="divLogoHome">
                    <img src={imgLogin} alt="foto logo"className="imgLogo" />
                </div>
                <div>
                    <ul >
                        <Link to="/projeto" className="linkprojetos">Meus Projetos</Link>
                    </ul>
                    <ul>
                        <Link></Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}