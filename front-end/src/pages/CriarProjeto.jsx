import {useState} from "react"
import "../App.css"
import {Link} from "react-router-dom"
export default function CriaProjeto () {
    const [nome, setNome] = useState()
    const [orcamento, setOrcamento] = useState()
    const [descricao, setDescricao] = useState()
    const [categoria, setCategoria] = useState()
    const [aparecer, setaparecer] = useState(false)
    const [data, setData] = useState()
    const [Loading, setLoading] = useState(false)
    const [projeto, setProjeto] = useState(false)

    const SalvaProjeto = async (e) => {
        e.preventDefault();
        if(!nome || !data || !orcamento || !descricao || !categoria) {
            alert('Preencha todos os campos')
            return
        }   

        try {
            setLoading(true)
            const url = 'http://localhost:3001/api/cadastrar-projeto'

            const dados = {
                nome: nome,
                orcamento: orcamento,
                descricao: descricao,
                data: data,
                categoria: categoria
            }

            const enviar_projeto = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(dados)
            })
            const resposta_servidor = await enviar_projeto.json()
            if(enviar_projeto.ok) {
                setTimeout(() => {
                    setProjeto(true)
                })
            } else {
                setProjeto(false)
                alert(resposta_servidor.error)
            }
        } catch (error) {
            alert('Erro ao enviar dados para o servidor')
        }  finally {
            setLoading(false)
        }  
    }
    const Limpar = () => {
        setNome('')
        setOrcamento('')
        setDescricao('')
        setCategoria('')
        setData('')
    }

    return (
        <div className="containerCriarProjeto">
            {projeto && <div className="ProjetoSalvo">Projeto Salvo</div> }
            <div className="divH1CriarProjeto">
                <h1>Criar Projeto</h1>
                <p>Crie seu projeto para depois adicionar os serviços</p>
            </div >
            <form className="formCriarProjeto">
                <div className="fromnomeProjeto">
                    <label htmlFor="">Nome do projeto:</label>
                    <input type="text" required placeholder="Insira o nome do projeto" value={nome} onChange={(e) => setNome(e.target.value)}/>
                </div>
                <div className="fromOrcamento">
                    <label htmlFor="">Orçamento do projeto:</label>
                    <input type="number" required placeholder="Insira o orçamento total" value={orcamento} onChange={(e) => setOrcamento(e.target.value)}/>
                </div>
                <div className="fromDescricao">
                    <label htmlFor="">Descrição do projeto:</label>
                    <input type="text" required placeholder="Descreva o projeto" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
                </div>
                <div className="formData">
                    <label htmlFor="">Data:</label>
                    <input type="date" value={data} autoComplete="on" onChange={(e) => setData(e.target.value)}/>
                </div>
                <div className="fromCategoria">
                    <label htmlFor="">Selecione a categoria:</label>
                    <select name="" className="fromSelect" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        <option value="">Selecione a categoria</option>
                        <option value="Design">Design</option>
                        <option value="Desenvolvimento">Desenvolvimento</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Escrita">Escrita</option>
                    </select>
                </div>
                <div className="botoes">
                    <div className="divButtonCriarProjeto">
                        <button type="button" onClick={SalvaProjeto}>
                            {Loading ? 'Carregando...': 'Criar projeto'}
                        </button>
                    </div>
                    <div className="divButtonLimpar">
                        <button type="button" onClick={Limpar}>Limpar</button>
                    </div>
                    {Loading &&  <div className='loading-indicator'></div> }
                </div>    
            </form>
            
        </div>
    )
}