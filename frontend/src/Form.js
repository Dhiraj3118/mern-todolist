import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

function Form(props)
{
    const [text, setText] = useState(''); 
    
    const changeHandler = (e) => {
        setText(e.target.value)   
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter")
        {
            props.submit(text)
            setText('');
        }
    }
    
    return(
        <TextField 
            label="To Do ..."
            fullWidth
            style = {{ marginLeft:'1rem', width: '350px', boxSizing: 'border-box' }}
            value = {text}
            onChange = {changeHandler}
            onKeyDown = {handleKeyDown}
        />
    );
}

export default Form;