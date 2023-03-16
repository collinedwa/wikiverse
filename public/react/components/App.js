import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';
import { AddingPage } from "./AddingPage"

// import and prepend the api url to any fetch calls
import apiURL from '../api';

export const App = () => {
	const [search, setSearch] = useState("");
	const [pages, setPages] = useState([]);
	const [addingPage, setAddingPage] = useState(false);
	const [searchingPage, setSearchingPage] = useState(false);

	const searchResult = async () => {
		setSearchingPage(true);
		const response = await fetch(`${apiURL}/wiki/search?search=${search}`);
		const pagesData = await response.json();
		setPages(pagesData);
	}

	async function fetchPages(){
		try {
			const response = await fetch(`${apiURL}/wiki`);
			const pagesData = await response.json();
			setPages(pagesData);
		} catch (err) {
			console.log("Oh no an error! ", err)
		}
	}

	const clickHandler = () => {
		fetchPages();
		setAddingPage(!addingPage);
		setSearchingPage(!searchingPage)
	}

	useEffect(() => {
		fetchPages();
	}, []);

	return (<>
		<input type="text" aria-label="search" value={search} onChange={(e) => {setSearch(e.target.value)}}/>
		<button onClick={()=>{searchResult()}} disabled={search.length<1}>Search</button>
		<main>	
			{!addingPage ? <PagesList pages={pages} setPages={setPages} fetchPages={fetchPages} 
			searchingPage={searchingPage} setSearchingPage={setSearchingPage}/> : null}
			{!addingPage ? <button onClick={clickHandler} className="button">Add a page</button> : null}
			{addingPage ? <><AddingPage/> 
			<button onClick={clickHandler}>Back</button>
			</>: null}
		</main>
		</>
	)
}