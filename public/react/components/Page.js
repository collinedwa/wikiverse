import React, {useState, useEffect} from 'react';
import {UpdatingPage} from "./UpdatingPage"

import gqlURL from "../gql";

export const Page = (props) => {
  [pageData, setData] = useState({});
  [display, setDisplay] = useState(false);
  [updatingPage, setUpdatingPage] = useState(false);

  const getData = async () => {
    //modifies state & display of app
    props.setSearchingPage(false);
    await props.setPages([props.page]);
    //fetches specific page data
    const res = await fetch(`${gqlURL}`, {
      method: "POST",
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          query:`
          query{
              getPage(
                  slug: "${props.page.slug}"
              ){
                  id
                  slug
                  title
                  content
                  author{
                    name
                    email
                  }
                  tags{
                    name
                  }
                  createdAt
                  updatedAt
              }
          }
          `,
          variables: {slug: props.page.slug}
      })
    });
    const data = await res.json();
    setData(data.data.getPage);
    setDisplay(true);
  }

  const deletePage = async () => {
    const res = await fetch(`${gqlURL}`, {
      method: "POST",
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          query:`
          mutation{
              deletePage(
                id: "${props.page.id}"
              ){
                title
              }
          }
          `,
          variables: {id: props.page.id}
      })
    });
    const data = await res.json();
    setDisplay(false);
    await props.fetchPages();
    await props.fetchTags();
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
    //handles data for deleted authors
    const authorName = (data.author) ? data.author.name : "[DELETED]";

    //formats date
    const date = data.createdAt.substring(0,10)

    return <>
    <h2 className="page-title">{data.title}</h2>
    <div className="info-box">
    <p className="key">Author: </p>
    <p className="value">{authorName}</p>
    </div>
    <div className="info-box">
    <p className="key">Published:</p> 
    <p className="value">{date}</p>
    </div>
    <p className="content">{data.content}</p>
    <div className="info-box">
    <p className="key">Tags:</p>
    </div>
    {data.tags.map((tag)=> <p className="tag">{tag.name}</p>)}
    </>
  }

  return <>
    <h3 className="page-link" hidden={display || updatingPage} onClick={()=>{getData()}}>{props.page.title}</h3>
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
    {updatingPage ? <UpdatingPage data={pageData} slug={props.page.slug} 
    fetchPages={props.fetchPages} setUpdatingPage={setUpdatingPage} 
    setDisplay={setDisplay} fetchTags={props.fetchTags}/> : null}
  </>
} 
	