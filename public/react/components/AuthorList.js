import React, {useState} from 'react';
import { Author } from './Author';

export const AuthorList = ({authors, setPages, fetchPages, searchingPage, setSearchingPage}) => {
	
	return <>
		{
			authors.map((author, idx) => <Author author={author}/>)
		}
	</>
} 
