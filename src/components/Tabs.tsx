import React from 'react';
import { Link } from 'react-router-dom';

interface TabsProps {
    data: {
        name: string,
        link: string,
        active: boolean,
    }[];
}

function Tabs({data} : TabsProps) {
    return (
        <div className='tabs'>
            {
                data.map((data) => (
                    <Link to={data.link}>
                        <button className={data.active && 'active'}> {data.name} </button>
                    </Link>
                ))
            }
        </div>
    );
}

export default Tabs;