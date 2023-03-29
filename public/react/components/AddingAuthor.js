import React, { useState, useEffect } from 'react';

import gqlURL from '../gql';

export function AddingAuthor({userClickHandler}){
    const [authName, setAuthName] = useState("")
    const [authEmail, setAuthEmail] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${gqlURL}`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation{
                    createUser(
                        name: "${authName}",
                        email: "${authEmail}"
                    ){
                        name
                    }
                }
                
                `
            })
        });

        const data = await response.json();
        userClickHandler();
        setAuthName('');
        setAuthEmail('');
    }

    const authDisabledState = (authName.length < 3 || authEmail.length < 3)

    return <>
    <h2>Add a user</h2>
    <form onSubmit={handleSubmit} id="add-page">
    <input type="text" placeholder="Name" aria-label="authName" value={authName} onChange={(e) => {setAuthName(e.target.value)}}/>
    <input type="text" placeholder="E-mail" aria-label="authEmail" value={authEmail} onChange={(e) => {setAuthEmail(e.target.value)}}/>
    <button type="submit" className="button" disabled={authDisabledState}>Submit</button>
    </form>
    </>
}