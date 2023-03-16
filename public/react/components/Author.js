import React, {useState, useEffect} from 'react';

import apiURL from '../api';

export const Author = (props) => {
  [pageData, setData] = useState({});

  const getData = async () => {
    await props.setPages([props.page]);
    const res = await fetch(`${apiURL}/wiki/${props.author.id}`)
    const data = await res.json();
    setData(data);
  }


  return <>
    <h3 className="page-link" onClick={()=>{getData()}}>{props.author.name}</h3>
  </>
} 
	