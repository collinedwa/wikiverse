import React, { useState, useEffect } from 'react';

import apiURL from '../api';

export function UpdatingPage({data, slug, fetchPages, setUpdatingPage, setDisplay, fetchTags}){
    let tagString = "";

    data.tags.map((tag) => {tagString += (tag.name + " ")})
    
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState("")
    const [articleData, setArticleData] = useState({})

    const handleData = () => {
        let pushedTitle = title;
        let pushedContent = content;
        let pushedTags = tags;

        if (title.length < 3 || title == "") pushedTitle = data.title;
        if (content.length < 3 || content == "") pushedContent = data.content;
        if (tags == "") pushedTags = tagString;

        setArticleData({
            title: pushedTitle, content: pushedContent, tags: pushedTags
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiURL}/wiki/${slug}`, {
            method: "PUT",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(articleData)
        });
        try{
        const data = await response.json();
        }catch(err){
            console.log(err);
        }
        fetchPages();
        fetchTags();
        setUpdatingPage(false);
        setDisplay(false);
        setTitle('');
        setContent('');
        setTags('');
    }

    const backButton = async () => {
        setUpdatingPage(false);
        setDisplay(true);
    }

    const updatePageDisabledState = (title.length < 3 && content.length < 3 && tags.length < 3)

    return <>
    <form onSubmit={handleSubmit}>
    <input type="text" placeholder={data.title} aria-label="title" value={title} onChange={(e) => {setTitle(e.target.value)}}/>
    <div className="info-box">
    <p className="key">Author:</p>
    <p className="value">{data.author.name}</p>
    </div>
    <div className="info-box">
    <p className="key">Published:</p> 
    <p className="value">{data.createdAt}</p>
    </div>
    <input className="content" type="text" placeholder={data.content} aria-label="content" value={content} onChange={(e) => {setContent(e.target.value)}}/>
    <div className="info-box">
    <p className="key">Tags:</p>
    </div>
    <input type="text" placeholder={tagString} aria-label="tags" value={tags} onChange={(e) => {setTags(e.target.value)}}/>
    <div className="button">
    <button onClick={()=>{backButton()}}>Back</button>
    <button type="submit" onClick={()=>{handleData()}} disabled={updatePageDisabledState}>Submit</button>
    </div>
    </form>
    </>
}