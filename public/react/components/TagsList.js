import React from 'react';

export const TagsList = ({tags, searchResult, setSearch}) => {

	/*const tagSearch = async (tag) => {
		setSearch(tag)
		await searchResult();
	}
	*/

    //temp fix for a weird error
    if(!tags) return null;
	
	return <>
		{   
			tags.map((tag) => <><h3 className="page-link" onClick={()=>{setSearch(tag.name)}}>#{tag.name}</h3>
								<p className="tag-list">{tag.pageCount} page{(tag.pageCount > 1) ? "s" : ""}</p></> )
		}
	</>
} 
