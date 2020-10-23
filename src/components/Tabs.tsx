import React from 'react';
import { Link } from 'react-router-dom';

interface TabDataLink {
    name: string;
    link: string;
    active: boolean;
};

interface TabDataOnClick {
    name: string;
    onClick: () => void;
    active: boolean;
};

export type TabData = TabDataLink | TabDataOnClick;

interface TabsProps {
    data: TabData[];
}

function Tabs({data} : TabsProps) {
    return (
        <div className='tabs'>
            {
                data.map((data) => {
                    if ("link" in data) return (
                        <Link to={data.link}>
                            <button className={data.active ? 'active' : undefined}> {data.name} </button>
                        </Link>
                    );
                    else return (
                        <button className={data.active ? 'active' : undefined} onClick={data.onClick}> {data.name} </button>
                    );
                } )
            }
        </div>
    );
}

export default Tabs;