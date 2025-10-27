import imgLogin from "../img/img-login2.png"
import {Link} from 'react-router-dom'
import {FaBars} from 'react-icons/fa'
import "../App.css";
import { useState } from "react";
export default function Navbar () {
    const [Aparecer, setAparecer] = useState(false)
    const Opcoes = () => {
        setAparecer(!Aparecer)
    }  
    return (
        <div>
            <div className="navbar">
                <div className="divLogoHome">
                    <img src={imgLogin} alt="foto logo"className="imgLogo" />
                </div>
                <div className='lista' >
                    <ul className="lista-ul">
                        <Link className="lista-link" to={'/home'}>Home</Link>
                    </ul>
                    <ul  className="lista-ul">
                        <Link className="lista-link" to="/projeto">Meus Projetos</Link>
                    </ul>
                    <ul className="lista-ul">
                        <Link className="lista-link" to={'/criar-projeto'}>Criar Projeto</Link>
                    </ul>
                </div>
                <div className="icone_bras"> 
                    <FaBars onClick={Opcoes}></FaBars>
                </div>
            </div>
            <div className={`lista-mobile ${Aparecer ? 'ativo': ''}` }  >
                <ul className="lista-mobile-ul">
                    <Link className="lista-mobile-link" to={'/home'}>Home</Link>
                </ul>
                <ul  className="lista-ul">
                    <Link className="lista-mobile-link" to="/projeto">Meus Projetos</Link>
                </ul>
                <ul className="lista-ul">
                    <Link className="lista-mobile-link" to={'/criar-projeto'}>Criar Projeto</Link>
                </ul>
            </div>
        </div>
    )
}