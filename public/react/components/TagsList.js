import React from 'react';

export const TagsList = ({tags, searchResult, setSearch}) => {

	//not working correctly
	const tagSearch = async (tag) => {
		setSearch(tag);
		searchResult();
	}


    //temp fix for a weird error
    if(!tags) return null;

	function Tag({tag, setSearch}){
		return<>
		<h3 className="page-link" onClick={()=>{setSearch(tag.name)}}>#{tag.name}</h3>
		<p className="tag-list">{tag.pageCount} page{(tag.pageCount > 1) ? "s" : ""}</p>
		</>
	}
	
	return <>
		{   
			tags.map((tag, idx) => <Tag tag={tag} key={idx} setSearch={setSearch}/>)
		}
	</>
} 
