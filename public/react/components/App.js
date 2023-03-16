import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';
import { AddingPage } from "./AddingPage"
import { AuthorList } from "./AuthorList";

// import and prepend the api url to any fetch calls
import apiURL from '../api';

export const App = () => {
	const [search, setSearch] = useState("");
	const [pages, setPages] = useState([]);
	const [authors, setAuthors] = useState([]);
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

	async function fetchAuthors(){
		try {
			const response = await fetch(`${apiURL}/users`);
			const authorsData = await response.json();
			setAuthors(authorsData);
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
		fetchAuthors();
	}, []);

	return (<>
		<header>
        <logo>
            <h1>WikiVerse</h1>
            <h2>An interesting 📚</h2>
        </logo>
		<input type="text" aria-label="search" value={search} onChange={(e) => {setSearch(e.target.value)}}/>
		<button onClick={()=>{searchResult()}} disabled={search.length<1}>Search</button>
    	</header>
		<main>
			<authors>
			<h1 className="top-of-list">Authors</h1>
			<AuthorList authors={authors}/>
			</authors>
			<pages>
			<h1 className="top-of-list">Articles</h1>
			{!addingPage ? <PagesList pages={pages} setPages={setPages} fetchPages={fetchPages} 
			searchingPage={searchingPage} setSearchingPage={setSearchingPage}/> : null}
			{!addingPage ? <button onClick={clickHandler} className="button">Add a page</button> : null}
			{addingPage ? <><AddingPage/> 
			<button className="button" onClick={clickHandler}>Back</button>
			</>: null}
			</pages>
			<tags>
			<h1 className="top-of-list">Tags</h1>
			</tags>
		</main>
		</>
	)
}