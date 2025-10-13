import React from "react"
import { useParams, useSearchParams } from 'react-router-dom'
export default function EditaProjeto () {
    const [SearchParams] = useSearchParams()
    const id = SearchParams.get('id')
    console.log(id)
    return (
        <div>
            <div>
                <h1>ola</h1>
            </div>
        </div>
    )
}