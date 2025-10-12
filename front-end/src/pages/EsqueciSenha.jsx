import {useState} from 'react'
import { FaEnvelope } from "react-icons/fa"
import "../App.css";
import imgLogin from "../img/img-login2.png";
import {useNavigate} from 'react-router-dom'
export default function EsqueciSenha() {
    const [email, setEmail] = useState("")
    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const EsqueciSenha = async (e) => {
        e.preventDefault()

        if (!email.includes('@')) {
            alert("Email invalido")
            return
        }
        if (!email) {
            alert('Preencha o campo email')
            return
        }

        try {
            setLoading(true)
            const url = 'http://localhost:3001/api/esqueci-senha'
            const enviar_esqueci_senha = await fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            })

            const reposta_servidor_esqueci_senha = await enviar_esqueci_senha.json()
            if(enviar_esqueci_senha.ok) {
                setEmail('')
            }
            else {
                alert(reposta_servidor_esqueci_senha.error)
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
                <img src={imgLogin} alt="logo" className='imgLogin' />
                <h1>PROJECT MANAGER</h1>
            </div>
            <form onSubmit={EsqueciSenha} className='formLogin' autoComplete='on'>
                <h1 className='loginh1'>Esqueci minha senha</h1>
                <div className='divInputEmail'>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" placeholder='Digite seu e-mail' value={email} required  onChange={(e) => setEmail(e.target.value)}/>
                    <FaEnvelope className = 'input-icon' />
                </div>
                <div className='divButton'>
                    <button type="submit">
                        {Loading ? 'Carrregando...': 'Recuperar senha'}
                    </button>
                </div>  
                {Loading && <div className='loading-indicator'></div>} 
            </form>
        </div>
    )
}