import React, { useState, useEffect } from 'react';

import apiURL from '../api';

export function AddingAuthor(){
    const [authName, setAuthName] = useState("")
    const [authEmail, setAuthEmail] = useState("")
    const [newAuthData, setNewAuthData] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthName('');
        setAuthEmail('');
        const response = await fetch(`${apiURL}/users/`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAuthData)
        });

        const data = await response.json();
    }

    const authDisabledState = (authName.length < 3 || authEmail.length < 3)

    return <>
    <h2>Add a user</h2>
    <form onSubmit={handleSubmit} id="add-page">
    <input type="text" placeholder="Name" aria-label="authName" value={authName} onChange={(e) => {setAuthName(e.target.value)}}/>
    <input type="text" placeholder="E-mail" aria-label="authEmail" value={authEmail} onChange={(e) => {setAuthEmail(e.target.value)}}/>
    <button type="submit" onClick={()=>{setNewAuthData({
        name:authName, email:authEmail
        });}} className="button" disabled={authDisabledState}>Submit</button>
    </form>
    </>
}