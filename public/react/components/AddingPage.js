import React, { useState, useEffect } from 'react';

import apiURL from '../api';

export function AddingPage({clickHandler}){
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [author, setAuthor] = useState("")
    const [authorEmail, setAuthorEmail] = useState("")
    const [tags, setTags] = useState("")
    const [articleData, setArticleData] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiURL}/wiki/`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(articleData)
        });

        const data = await response.json();
        clickHandler();
        setTitle('');
        setContent('');
        setAuthor('');
        setAuthorEmail('');
        setTags('');
    }

    const addPageDisabledState = (title.length < 3 || author.length < 3 || authorEmail.length < 3 || content.length < 3)

    return <>
    <h2>Add a page</h2>
    <form onSubmit={handleSubmit} id="add-page">
    <input type="text" placeholder="Title" aria-label="title" value={title} onChange={(e) => {setTitle(e.target.value)}}/>
    <input type="text" placeholder="Content" aria-label="content" value={content} onChange={(e) => {setContent(e.target.value)}}/>
    <input type="text" placeholder="Author" aria-label="author" value={author} onChange={(e) => {setAuthor(e.target.value)}}/>
    <input type="text" placeholder="E-mail" aria-label="authorEmail" value={authorEmail} onChange={(e) => {setAuthorEmail(e.target.value)}}/>
    <input type="text" placeholder="Tags" aria-label="tags" value={tags} onChange={(e) => {setTags(e.target.value)}}/>
    <button type="submit" onClick={()=>{setArticleData({
        title:title, content:content, name:author, email:authorEmail, tags:tags
        });}} className="button" disabled={addPageDisabledState}>Submit</button>
    </form>
    </>
}