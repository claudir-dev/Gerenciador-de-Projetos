import imgLogin from "../img/img-login2.png"
import {use, useState} from 'react'
import {FaSearch, FaFolder, FaTimes, FaCalendarAlt, FaMoneyBillAlt, } from 'react-icons/fa'
import {Link, Links} from 'react-router-dom'
import "../App.css";
export default function Projeto () {
    const [projeto, setProjeto] = useState()
    const [Loading, setLoading] = useState(false)
    const [Aparecer,setAparecer] = useState(false)
    const [resgata, setResgata] = useState([])
    const [FiltrosNome, setFiltrosNome] = useState('')
    const [divFiltros, setDivfiltros] = useState(false)
    const [FiltrosDescricao, setFiltrosDescricao] = useState('')
    const [FiltrosData, setFiltrosData] = useState('')
    const [marcado, setmarcado] = useState(false)
    const text_label = 'Todos os projetos'

    function mostrafiltros () {
        setDivfiltros(true)
        setProjeto('')
        setFiltrosNome('')
        setFiltrosDescricao('')
        setFiltrosData('')
        setmarcado(false)
    }

    const FecharFiltros = () => {
        setDivfiltros(false)
        setmarcado(false)
    }
    const aplicaFiltros = () => {
        const filtros = {}
        if (FiltrosNome.trim() !== '') filtros.nome = FiltrosNome;
        if (FiltrosDescricao.trim() !== '') filtros.descricao = FiltrosDescricao;
        if (FiltrosData.trim() !== '') filtros.data = FiltrosData;
        if(marcado) filtros.todos_projetos = marcado

        console.log(filtros)

        const filtroVisivel = getFiltroVisivel()
        setProjeto(prev => {
            if (prev && prev.includes(filtroVisivel)) return prev; // já existe, não adiciona
            return `${filtroVisivel} ${prev || ''}`.trim();
        });

        setDivfiltros(false)
    }
    const getFiltroVisivel = () => {
        const filtrosSelecionados = [];

        if (FiltrosNome.trim() !== '') filtrosSelecionados.push(FiltrosNome);
        if (FiltrosDescricao.trim() !== '') filtrosSelecionados.push(FiltrosDescricao);
        if (FiltrosData.trim() !== '') filtrosSelecionados.push(FiltrosData);
        if(marcado) filtrosSelecionados.push(text_label)
        

        return filtrosSelecionados.join(' ');
    };
    const BuscaProjeto = async () => {

        if(!projeto) {
            return alert('Preenchar o campo')
        }

        try {
            setLoading(true)
            const url = `http://localhost:3001/api/buscar-projeto`
            
            const buscar_projeto = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                credentials: 'include',
                body: JSON.stringify({projeto})
            })

            const reposta_projeto = await buscar_projeto.json()
            console.log(reposta_projeto)
            setResgata(reposta_projeto)
            if(buscar_projeto.ok) {
                setAparecer(true)
                setProjeto('')
            }
            else {
                setAparecer(false)
                alert(reposta_projeto.error)
            }
        } catch (error) {
            console.error('Error ao enviar dados para o servidor', error)
            alert('Error ao enviar dados para o servidor')
        } finally {
            setLoading(false) 
        }
    }
    const edita_projeto = async () => {

    }
    return (
        <div className="ConteinerPai">
            {divFiltros && <div className="card-filtros"> 
                <div className="icone-X">
                    <FaTimes onClick={FecharFiltros}></FaTimes>
                </div>
                <h3>Filtros</h3>
                <div className="div-campos">
                    <label htmlFor="">Nome:</label>
                    <input type="text" placeholder="Buscar por nome..." value={FiltrosNome} onChange={(e) => setFiltrosNome(e.target.value)} />
                </div>
                <div className="div-campos">
                    <label htmlFor="">Descrição:</label>
                    <input type="text" placeholder="Busca por descrição..." value={FiltrosDescricao} onChange={(e) => setFiltrosDescricao(e.target.value)}/>
                </div>
                <div className="div-campos">
                    <label htmlFor="">Data:</label>
                    <input type="date" value={FiltrosData} onChange={(e) => setFiltrosData(e.target.value)}/>
                </div>
                <div className="todos-projetos">
                    <label htmlFor="">{text_label}</label>
                    <input type="checkbox" checked={marcado} onChange={(e) => setmarcado(e.target.checked)}/>
                </div>
                <div className="div-campos">
                    <button onClick={aplicaFiltros}>
                        Aplica
                    </button>
                </div>
            </div>}
            <div className="nav_bar" style={{marginBottom: '30px', }}>
                <div className="img">
                    <img src={imgLogin} alt="foto-login" />
                </div>
                <div className="title">
                    <h1>Meus projetos</h1>
                </div>
            </div>  
            <div className="Pesquisa">
                <div className="icon">
                    <FaSearch></FaSearch>
                </div>
                <div className="input">
                    <input type="text" placeholder='Buscar projeto...' value={projeto} onChange={(e) => setProjeto(e.target.value)}/>
    
                </div>
                <div className="btn">
                    <button type="button" onClick={BuscaProjeto} className="btn-busca">
                        {Loading ? 'Carregando...': 'Buscar'}
                    </button>
                    <button type="button" className="btn-filtro" onClick={mostrafiltros} >
                        Filtros
                    </button>
                    <div className="div-btn-criarProjeto">
                        <Link to={'/criar-projeto'} className="btn-criarProjeto">
                            + Criar Projeto
                        </Link>
                    </div> 
                </div>
            </div>
            <div className="main" style={{marginTop: '60px'}}>
                <div className="btn_div">
                    {Loading && <div className='loading-indicator'></div> }
                    {Aparecer && (
                    <div className="div-cards">
                        {resgata.map((item, i) => (
                        <div className="card" key={item.id}>
                            <div className="card_header">
                            <FaFolder className="card_icon" />
                            <h2 className="card_title">{item.nome}</h2>
                            </div>
                            <div className="card-descricao">
                                {item.descricao ? item.descricao : 'Descrição não encontrada'}
                            </div>
                            <div className="card-orcamento">
                                <FaMoneyBillAlt style={{marginTop: '2px'}}></FaMoneyBillAlt>
                                {item.orcamento ? item.orcamento : 'Orçamento não encontrado'}
                            </div>
                            <div className="card-data">
                                <FaCalendarAlt style={{marginRight: '5px'}}></FaCalendarAlt>
                                {item.data ? item.data : 'Data não encontrada'}
                            </div>
                            <Link className="btn_detalhes" to={`Editar-projeto?id=${item.id}`}>Ver detalhes</Link>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>  
        </div>
    )
}