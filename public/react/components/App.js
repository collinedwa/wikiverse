import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';
import { AddingPage } from "./AddingPage";
import { AuthorList } from "./AuthorList";
import { AddingAuthor } from "./AddingAuthor";
import { TagsList } from "./TagsList";

// import and prepend the api url to any fetch calls
import gqlURL from "../gql";

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
		const response = await fetch(`${gqlURL}`, {
			method: "POST",
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query:`
				query{
					getSearchResults(
						query: "${search}"
					){
						id
						title
						slug
						content
						createdAt
						updatedAt
					}
				}
				`,
				variables: {query: search}
			})
		  });
		const pagesData = await response.json();
		setPages(pagesData.data.getSearchResults);
	}

	async function fetchPages(){
		try {
			const response = await fetch(`${gqlURL}`, {
				method: "POST",
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query:`
					query{
						getPages{
							id
							title
							slug
							content
							createdAt
							updatedAt
						}
					}
					`,
					variables: {}
				})
			  });
			const pagesData = await response.json();
			console.log(pagesData)
			setPages(pagesData.data.getPages);
		} catch (err) {
			console.log("Oh no an error! ", err)
		}
	}

	async function fetchTags(){
		try {
			const response = await fetch(`${gqlURL}`, {
				method: "POST",
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query:`
					query{
						getTags{
							name
							createdAt
							pageCount
						}
					}
					`,
					variables: {}
				})
			});
			const tagsData = await response.json();
			setTags(tagsData.data.getTags);
		} catch (err) {
			console.log("Oh no an error! ", err)
		}

	}

	async function fetchAuthors(){
		try {
			const response = await fetch(`${gqlURL}`, {
				method: "POST",
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query:`
					query{
						getUsers{
							id
							name
							email
							pages{
							  title
							}
						}
					}
					`,
					variables: {}
				})
			});
			const authorsData = await response.json();
			setAuthors(authorsData.data.getUsers);
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
			<TagsList tags={tags} searchResult={searchResult} setSearch={setSearch}/>
			</trending>
		</main>
		</>
	)
}