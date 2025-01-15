import React from 'react'
import { useNavigate } from 'react-router-dom';

interface CountCardProps {
    title: string;
    count: number;
    details: {};
    apiName: string;
}

function CountCard(card: CountCardProps) {
    const navigate = useNavigate();
    function handleView(apiName: string) {
        navigate(`/view/${apiName}`);
    }

    return (
        <div className='card' onClick={() => handleView(card.apiName)}>
            <h1>{card.title}</h1>
            <h2>{card.count}</h2>
        </div>
    )
}

export default CountCard
