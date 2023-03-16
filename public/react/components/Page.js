import React, {useState, useEffect} from 'react';
import {UpdatingPage} from "./UpdatingPage"

import apiURL from '../api';

export const Page = (props) => {
  [pageData, setData] = useState({});
  [display, setDisplay] = useState(false);
  [updatingPage, setUpdatingPage] = useState(false);

  const getData = async () => {
    props.setSearchingPage(false);
    await props.setPages([props.page]);
    const res = await fetch(`${apiURL}/wiki/${props.page.slug}`)
    const data = await res.json();
    setData(data);
    setDisplay(true);
  }

  const deletePage = async () => {
    const res = await fetch(`${apiURL}/wiki/${props.page.slug}`, {
      method: "DELETE"
  })
    const data = await res.json();
    await props.fetchPages();
    setDisplay(false);
  }

  const pageUpdate = async() => {
    setUpdatingPage(!updatingPage);
    setDisplay(!display);
  }

  const backButton = async () => {
    await props.fetchPages();
    setDisplay(!display);
  }

  function PageData({data}){
    return <>
    <h2 className="page-title">{data.title}</h2>
    <div className="info-box">
    <p className="key">Author: </p>
    <p className="value">{data.author.name}</p>
    </div>
    <div className="info-box">
    <p className="key">Published:</p> 
    <p className="value">{data.createdAt}</p>
    </div>
    <p className="content">{data.content}</p>
    <div className="info-box">
    <p className="key">Tags:</p>
    </div>
    {data.tags.map((tag)=> <p className="tag">{tag.name}</p>)}
    </>
  }

  return <>
    <h3 hidden={display || updatingPage} onClick={()=>{getData()}}>{props.page.title}</h3>
    {(display && !props.searchingPage) ? <>
    <div className="page-data">
    <PageData data={pageData}/>
    <div className="buttons">
    <button onClick={()=>{backButton()}}>Back</button>
    <button onClick={()=>{pageUpdate()}}>Update</button>
    <button onClick={()=>{deletePage()}}>Delete</button>
    </div>
    </div>
    </> : null}
    {updatingPage ? <UpdatingPage data={pageData} slug={props.page.slug} fetchPages={props.fetchPages} setUpdatingPage={setUpdatingPage} setDisplay={setDisplay}/> : null}
  </>
} 
	