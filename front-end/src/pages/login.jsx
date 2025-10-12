import {useState} from 'react'
import "../App.css";
import imgLogin from "../img/img-login2.png"; 
import { FaEnvelope, FaEye, FaEyeSlash  } from "react-icons/fa"
import {useNavigate, Link} from "react-router-dom"
export default function Login() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const Entrar = async (e) => {
        e.preventDefault()
        if (!email || !senha) {
            alert("Preencha todos os campos")
            return
        }   
        if (!email.includes('@')) {
            alert("Email invalido")
            return
        }  

        try {
            setLoading(true)
            const url = 'http://localhost:3001/api/login'
            const dados = {
                email: email,
                senha: senha
            }

            const enviar_dados_login = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(dados)
            })

            const reposta_servidor = await enviar_dados_login.json()
            console.log(reposta_servidor)
            if (enviar_dados_login.ok) {
                navigate('/Home')
            } else {
                alert(reposta_servidor.error)
            }
        } catch (error) {
            console.error('Erro ao enviar dados para o servidor:', error);
            alert("Erro ao conectar com o servidor")
        } finally {
            setLoading(false)
        }
        
    }  
    return (
        <div className='containerLogin'>
            <div className='divLogoLogin'>
                <img src={imgLogin} alt="logo"  className='imgLogin'/>
                <h1>PROJECT MANAGER</h1>
            </div>
            <div>
                <form onSubmit={Entrar} className='formLogin' autoComplete='on'>
                    <h1 className='loginh1'>Login</h1>
                    <div className='divInputEmail'>
                        <label htmlFor="Email">E-mail</label>
                        <input type="email" placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} required />
                       <FaEnvelope className="input-icon" />
                    </div> 
                    <div className='divInputSenha'>
                    <label htmlFor="senha">Senha</label>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            placeholder='Senha'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        {/* Ícone que muda ao clicar */}
                        <span
                            className="input-olho"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>  
                    <div className='divLinks'>
                        <Link to="/CriarConta" className="linkCriarConta">Criar conta</Link>
                        <Link to={"/EsqueciSenha"} className="linkCriarConta">Esqueci minha senha</Link>
                    </div>
                    <div className='divButton'>
                        <button type='submit'>
                            {loading ? 'Carregando...': 'Entrar'}
                        </button>
                    </div>
                    {loading && <div className="loading-indicator"></div>}
                </form>
            </div>
        </div>
    )
}