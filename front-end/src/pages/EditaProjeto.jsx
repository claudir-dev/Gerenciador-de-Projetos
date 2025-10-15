import React, { use } from "react"
import { FaEnvelopeSquare } from "react-icons/fa"
import { useSearchParams,useLocation } from 'react-router-dom'
import {useState, useEffect} from 'react'
import Navbar from '../components/NevBar.jsx'
import {FaTimes} from 'react-icons/fa'
export default function EditarProjeto () {
    const [SearchParams] = useSearchParams()
    const [divAparecer, setdivAparecer] = useState(false)
    const [captura, setcaptura] = useState([])
    const [divEditar, setdivEditar] = useState(false)
    const id = SearchParams.get('id')
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
                            <h1>Projeto: {item.nome}</h1>
                            <button className="btn_editar" onClick={editar} style={{marginRight: '20px'}}>Editar</button>
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

                {divEditar && (
                    <div className="card_editar">
                        <div>
                            <FaTimes></FaTimes>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                )}
            </div>    
            )}
        </div>
    )
}