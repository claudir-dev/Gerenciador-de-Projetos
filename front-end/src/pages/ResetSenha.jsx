import {useState} from 'react';
import imgLogin from "../img/img-login2.png";
import {FaEnvelope, FaEye, FaEyeSlash} from 'react-icons/fa'
import "../App.css";
import {useNavigate, useLocation} from 'react-router-dom'
export default function ResetSenha() {
    const [senha, setSenha] = useState()
    const [Loading, setLoading] = useState(false)
    const [MostraSenha, setMostraSenha] = useState(false)
    const navigate = useNavigate()

    const query = new URLSearchParams(useLocation().search) // Pega os parametros da url
    const token_url = query.get('token') // Pega o valor do parametro 'token' da url

    const AlteraSenha = async () => {
        if (!senha) {
            alert('Preencha o campo ')
            return
        }
        try {
            setLoading(true)
            const url_reset_senha = 'http://localhost:3001/api/reset-senha'
            const dados = {
                senha: senha,
                token: token_url
            }

            const enviar_reset_senha = await fetch(url_reset_senha, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(dados)
            })

            const resposta_servidor_reset_senha = await enviar_reset_senha.json()
            if(enviar_reset_senha.ok) {
                navigate('/')
            }
            else {
                alert(resposta_servidor_reset_senha.error)
            }
        } catch (error) {
            console.log('Erro ao enviar dados para o servidor:', error)
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
            <form onSubmit={AlteraSenha}  className='formLogin' autoComplete='on'>
                <h1 className='loginh1'>Esqueci minha senha</h1>
                <div className='divInputEmail'>
                    <label htmlFor="email">Nova senha</label>
                    <input type={MostraSenha ? "text" : "password"} placeholder='Digite sua senha' value={senha}  onChange={(e) => setSenha(e.target.value)}/>
                    {
                                            
                        MostraSenha ? <FaEye className='input-icon' onClick={() => setMostraSenha(!MostraSenha)}/> : <FaEyeSlash className='input-icon' onClick={() => setMostraSenha(!MostraSenha)}/>
                    
                    }
                </div>
                <div className='divButton'>
                    <button type="submit">
                        {Loading ? 'Carregando...': 'Redefinir senha'}
                    </button>
                </div> 
                <div>
                    {Loading && <div className='loading-indicator'></div>}
                </div>   
            </form>    
        </div>
    )
}