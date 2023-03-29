import React, { useState, useEffect } from 'react';

import gqlURL from "../gql";

export function AddingPage({clickHandler}){
    const [articleData, setArticleData] = useState({
        title: "",
        content: "",
        name: "",
        email: "",
        tags: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(articleData);
        const response = await fetch(`${gqlURL}`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query:`
                mutation{
                    createPage(
                        title: "${articleData.title}",
                        content: "${articleData.content}",
                        name: "${articleData.name}",
                        email: "${articleData.email}",
                        tags: "${articleData.tags}"
                    ){
                        title
                    }
                }
                `,
                variables: {articleData}
            })
        });
        const data = await response.json();
        console.log(data)
        clickHandler();
        setArticleData({
            title: "",
            content: "",
            name: "",
            email: "",
            tags: ""
        });
    }

    const addPageDisabledState = (articleData.title.length < 3 
        || articleData.name.length < 3 
        || articleData.email.length < 3 
        || articleData.content.length < 3);

    return <>
    <h2>Add a page</h2>
    <form onSubmit={handleSubmit} id="add-page">
    <input type="text" placeholder="Title" aria-label="title" value={articleData.title} onChange={(e) => {setArticleData({...articleData, title: e.target.value})}}/>
    <input type="text" placeholder="Content" aria-label="content" value={articleData.content} onChange={(e) => {setArticleData({...articleData, content: e.target.value})}}/>
    <input type="text" placeholder="Author" aria-label="name" value={articleData.name} onChange={(e) => {setArticleData({...articleData, name: e.target.value})}}/>
    <input type="text" placeholder="E-mail" aria-label="email" value={articleData.email} onChange={(e) => {setArticleData({...articleData, email: e.target.value})}}/>
    <input type="text" placeholder="Tags" aria-label="tags" value={articleData.tags} onChange={(e) => {setArticleData({...articleData, tags: e.target.value})}}/>
    <button type="submit" className="button" disabled={addPageDisabledState}>Submit</button>
    </form>
    </>
}