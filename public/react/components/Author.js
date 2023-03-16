import React, {useState} from 'react';

import apiURL from '../api';

export const Author = (props) => {
  [authData, setAuthData] = useState({});
  [authDisplay, setAuthDisplay] = useState(false);

  const getData = async () => {
    await props.setAuthors([props.author]);
    const res = await fetch(`${apiURL}/users/${props.author.id}`)
    const data = await res.json();
    setAuthDisplay(!authDisplay);
    setAuthData(data);
    console.log(data);
  }

  const backButton = async () => {
    await props.fetchAuthors();
    setAuthDisplay(!authDisplay);
  }

  const deleteUser = async () => {
    const res = await fetch(`${apiURL}/users/${props.author.id}`, {
      method: "DELETE"
  })
    const data = await res.json();
    await props.fetchAuthors();
    setAuthDisplay(false);
  }

  function AuthorData({data}){
    return <>
    <div className="info-box">
    <p className="key">Name:</p> 
    <p className="value">{data.name}</p>
    </div>
    <div className="info-box">
    <p className="key">Email:</p> 
    <p className="value">{data.email}</p>
    </div>
    <div className="info-box">
    <p className="key">Articles:</p>
    </div>
    {data.pages.map((article)=> <p className="tag">{article.title}</p>)}
    </>
  }


  return <>
    <h3 hidden={authDisplay} className="page-link" onClick={()=>{getData()}}>{props.author.name}</h3>
    {authDisplay ? <> 
    <div className="page-data">
    <AuthorData data={authData}/>
    <div className="buttons">
    <button className="button" onClick={()=>{backButton()}}>Back</button>
    <button className="button" onClick={()=>{deleteUser()}}>Delete</button>
    </div>
    </div>
    </>: null}
  </>
} 
	