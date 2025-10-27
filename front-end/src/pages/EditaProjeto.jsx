import React, { use } from "react"
import { FaEnvelopeSquare } from "react-icons/fa"
import { useSearchParams,useLocation, data } from 'react-router-dom'
import {useState, useEffect} from 'react'
import Navbar from '../components/NevBar.jsx'
import {FaTimes} from 'react-icons/fa'
import ProjetoAtualizado from "../components/ProjetoAtualizado.jsx"
export default function EditarProjeto () {
    const [SearchParams] = useSearchParams()
    const [divAparecer, setdivAparecer] = useState(false)
    const [captura, setcaptura] = useState([])
    const [divEditar, setdivEditar] = useState(false)
    const [arry,setarray] = useState([])
    const id = SearchParams.get('id')
    const [mostra, setmostra] = useState(false)
    useEffect(() => {
        const busca_edita = async () => {
            try {
                const url = 'http://localhost:3001/busca/edita/projeto'
                const busca_projeto_servidor = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({id})
                })
                const resposta_servidor = await busca_projeto_servidor.json()
                setcaptura([resposta_servidor])
                setarray([resposta_servidor])
                if(busca_projeto_servidor.ok) {
                    setdivAparecer(true)
                    console.log('projeto encotrado',resposta_servidor)
                } else {
                    setdivAparecer(false)
                    console.log('Error interno no servidor', busca_projeto_servidor.error)
                    alert(resposta_servidor.error)
                }
            } catch (error) {
                console.error('error ao enviar dados para o servidor', error)
                alert('Error ao enviar dados para o servidor')
            }    
        }
        if(id) {
            busca_edita()
        }

    }, [id])
    const editar = () => {
        setdivEditar(true)
    }
    const atualizar = (id, campo, valor) => {
        setarray(prev => 
            prev.map(proj =>
                proj.id === id ? { ...proj, [campo]: valor } : proj
            )
        )
    }
    const fecharCard = () => {
        setdivEditar(false)
    }
    const atualizarProjeto = async () => {
        
        const dados = {
            nome: arry[0].nome,
            descricao: arry[0].descricao,
            orcamento: arry[0].orcamento,
            data: arry[0].data,
            categoria: arry[0].categoria,
            id: id
        }
        console.log(dados)
        try {
            const url = 'http://localhost:3001/Atualizar/projeto'

            const enviar_atualizao = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(dados)
            })
            const resposta_atualiza = await enviar_atualizao.json()
            console.log(resposta_atualiza)
            if(enviar_atualizao.ok) {
                setTimeout(() => {
                    setmostra(false)
                    setdivEditar(true)
                    window.location.reload()
                },5000)
                setdivEditar(false)
                setmostra(true)
            }
        } catch (error) {
            console.error('erro ao enviar dados para servidor', error)
            alert('erro ao enviar dados para servidor')
        }    
    }
    return (
        <div className="conteiner">
            {divAparecer && (    
            <div className="projeto_editar">
                <div>
                    <Navbar></Navbar>
                </div>
                {captura.map((item) => (
                    <div className="edita_card" key={item.id}>
                        <div className="title">
                            <p><strong>Nome: {item.nome}</strong></p>
                            <button className="btn_editar" onClick={editar} style={{marginRight: '20px',marginTop: '2 0px'}}>Editar</button>
                        </div>    
                        <div className="dados">
                            <p><strong>Descrição:</strong> {item.descricao}</p>
                            <p><strong>Orçamento:</strong> R$ {item.orcamento}</p>
                            <p><strong>Data:</strong> {item.data}</p>
                            <p><strong>Categoria:</strong> {item.categoria}</p>
                        </div>    
                    </div>
                ))}
                <div className="linha">
                </div>
            </div>
            )}
            {mostra && (
                <ProjetoAtualizado></ProjetoAtualizado>
            )}
                
            <div className="div-atualizaar">

                {divEditar && (
                    <div className="card-atualizar">
                        <div  className="edita-icon">
                            <FaTimes onClick={fecharCard} className="iconFechar"></FaTimes>
                        </div>
                        <div>
                            {arry.map((proj) => (
                                <div key={proj.id}>
                                    <div className="edita-nome">
                                        <label >Nome do projeto:</label>
                                        <input type="text" value={proj.nome} onChange={(e) => atualizar(proj.id, 'nome', e.target.value)}></input>
                                    </div>  
                                    <div className="edita-descricao">
                                        <label htmlFor="">Descrição do projeto: </label>
                                        <input type="text" value={proj.descricao} onChange={(e) => atualizar(proj.id, 'descricao', e.target.value)} />
                                    </div> 
                                    <div className="edita-orcamento">
                                        <label htmlFor="">Orcçamento do projeto: </label>
                                        <input type="number"  value={proj.orcamento} onChange={(e) => atualizar(proj.id, 'orcamento', e.target.value)}/>
                                    </div>  
                                    <div className="edita-data">
                                        <label htmlFor="">Data: </label>
                                        <input type="date" value={proj.data} onChange={(e) => atualizar(proj.id, 'data', e.target.value )} />
                                    </div>
                                    <div className="edita-categoria">
                                        <label htmlFor="">Categoria: </label>
                                        <input type="text" placeholder="ex: pessoal..." value={proj.categoria}  onChange={(e)=> atualizar(proj.id,'categoria', e.target.value)} />
                                    </div>
                                    <div className="edita-buton">
                                        <button onClick={atualizarProjeto}>Atualizar</button>
                                    </div>
                                </div>    
                            ))}
                        </div>
                    </div>
                )}
            </div>  
        </div>      
    )
}