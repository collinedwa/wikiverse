import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';
import { AddingPage } from "./AddingPage";
import { AuthorList } from "./AuthorList";
import { AddingAuthor } from "./AddingAuthor";
import { TagsList } from "./TagsList";

// import and prepend the api url to any fetch calls
import apiURL from '../api';

export const App = () => {
	const [search, setSearch] = useState("");
	const [pages, setPages] = useState([]);
	const [tags, setTags] = useState([]);
	const [authors, setAuthors] = useState([]);
	const [addingPage, setAddingPage] = useState(false);
	const [addingAuthor, setAddingAuthor] = useState(false);
	const [searchingPage, setSearchingPage] = useState(false);

	const searchResult = async () => {
		//refreshes Page List based on search
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

	async function fetchTags(){
		try {
			const response = await fetch(`${apiURL}/tags`);
			const tagsData = await response.json();
			setTags(tagsData);
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
		//modifies Page List
		fetchPages();
		fetchTags();
		setAddingPage(!addingPage);
		setSearchingPage(!searchingPage);
	}

	const userClickHandler = () => {
		//modifies Author List
		fetchAuthors();
		setAddingAuthor(!addingAuthor);
	}

	useEffect(() => {
		fetchPages();
		fetchAuthors();
		fetchTags();
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
			{!addingAuthor ? <AuthorList authors={authors} setAuthors={setAuthors} fetchAuthors={fetchAuthors}/> : null}
			{!addingAuthor ? <button onClick={userClickHandler} className="button">Add a user</button> : null}
			{addingAuthor ? <><AddingAuthor userClickHandler={userClickHandler}/> 
			<button className="button" onClick={userClickHandler}>Back</button>
			</>: null}
			</authors>
			<pages>
			<h1 className="top-of-list">Articles</h1>
			{!addingPage ? <PagesList pages={pages} setPages={setPages} fetchPages={fetchPages} fetchTags={fetchTags}
			searchingPage={searchingPage} setSearchingPage={setSearchingPage}/> : null}
			{!addingPage ? <button onClick={clickHandler} className="button">Add a page</button> : null}
			{addingPage ? <><AddingPage clickHandler={clickHandler}/> 
			<button className="button" onClick={clickHandler}>Back</button>
			</>: null}
			</pages>
			<trending>
			<h1 className="top-of-list">Trending</h1>
			<TagsList tags={tags[0]} searchResult={searchResult} setSearch={setSearch}/>
			</trending>
		</main>
		</>
	)
}