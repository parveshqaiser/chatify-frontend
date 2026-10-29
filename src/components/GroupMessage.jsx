
import React from 'react'
import { useParams } from 'react-router-dom';

const GroupMessage = () => {

    let {id} = useParams();

    return (
        <div>
            welcome to group chst page
        </div>
    )
}

export default GroupMessage;