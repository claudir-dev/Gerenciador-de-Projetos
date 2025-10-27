import imgLogin from "../img/img-login2.png"
import imgHome from "../img/img-home.jpeg"
import Navbar from "../components/NevBar";
import "../App.css";
import {Link} from "react-router-dom"

export default function Home() {
    const Projeto = () => {
        window.location.href = "/criar-projeto"
    }
    return (
        <div className="containerHome">
            <div>
                <Navbar></Navbar>

            </div>
            <div className="mainHome">
                <div className="divImgHome">
                    <h1 className="title-hone">Bem vindo ao PROJECT MANAGER</h1>
                    <p>Comece a genrenciar seus projetos agora mesmo</p>
                    <button className="buttonHome" onClick={Projeto}>Criar projeto</button>
                    <img src={imgHome} alt="Banerfoto" />
                </div>
            </div>   
        </div>
    )
}