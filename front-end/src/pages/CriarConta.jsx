import {useState} from 'react'
import "../App.css";
import imgLogin from "../img/img-login2.png"; 
import { FaEnvelope, FaEye, FaEyeSlash  } from "react-icons/fa"
import {useNavigate} from "react-router-dom"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; 
export default function CriarConta() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setloading] = useState(false)
    const navegate = useNavigate();
        
    const Criarconta = async (e) => {
        e.preventDefault()
        if (!email || !senha) {
            alert("Preencha todos os campos")
            return
        }     
        const url = 'http://localhost:3001/api/criar-conta'

        const dados = {
            email: email,
            senha: senha
        }

        try {
            setloading(true)
            const envair_dados = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                
                },
                credentials: "include",
                body: JSON.stringify(dados)
            })
            const resposta = await envair_dados.json()
            if (envair_dados.ok) {
                navegate('/Home')
            } else {
                alert(resposta.error)
            }
        } catch (error) {
            console.error('Erro ao enviar dados para o servidor:', error);
        } finally {
            setloading(false)
        }
    } 
    const ContinuarGoogle = async (reponse) => {
        const token = reponse.credential
        const dado = jwtDecode(token)
        const googleEmail = dado.email

        try {
            const url = 'http://localhost:3001/api/continuar/google'
            const enviar_servidor_googel = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({googleEmail})
            })

            const response = await enviar_servidor_googel.json()
            if (enviar_servidor_googel.ok) {
                navegate('/home')
            }
            else {
                alert('erro interno no servidor') 
            }
        } catch (error) {
            console.error('erro ao envair dados para servidor',error)
            alert('error ao enviar dados para o servidor')
        }
    }
            
    return (
        <div className='containerLogin'>
            <div className='divLogoLogin'>
                <img src={imgLogin} alt="logo"  className='imgLogin'/>
                <h1>PROJECT MANAGER</h1>
            </div>
            <div>
                <form onSubmit={Criarconta} className='formLogin' autoComplete='on'>
                    <h1 className='loginh1'>Criar conta</h1>
                    <div className='divInputEmail'>
                        <label htmlFor="Email">E-mail</label>
                        <input type="email" placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
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
                    <div className='divButton'>
                        <button type='submit' >
                            {loading ? 'Carrregando' : 'Criar conta'}
                        </button>
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <GoogleLogin 
                            onSuccess={ContinuarGoogle}
                            onError={() => {
                                console.log('login falhou')
                                alert('Erro no login google')
                            }}
                        >
                            
                        </GoogleLogin>
                    </div>
                    {loading && <div className='loading-indicator'></div>}
                </form>
            </div>
        </div>
    )
}