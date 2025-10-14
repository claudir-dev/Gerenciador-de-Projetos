import React from "react"
import { FaEnvelopeSquare } from "react-icons/fa"
import { useSearchParams,useLocation } from 'react-router-dom'
import {useState, useEffect} from 'react'
export default function EditarProjeto () {
    const [SearchParams] = useSearchParams()
    const [divAparecer, setdivAparecer] = useState(false)
    const location = useLocation()
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
    
    return (
        <div>
            <div>
                {div}
            </div>
        </div>
    )
}