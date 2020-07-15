import React from 'react';

interface TitleProps {
    title : string,
};

function Title({ title } : TitleProps) {
    return (
        <div id={"title"} >
            { title }
        </div>
    );
}

export default Title;