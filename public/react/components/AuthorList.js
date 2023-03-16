import React, {useState} from 'react';
import { Author } from './Author';

export const AuthorList = ({authors, fetchAuthors, setAuthors}) => {
	
	return <>
		{
			authors.map((author, idx) => <Author author={author} fetchAuthors={fetchAuthors} setAuthors={setAuthors}/>)
		}
	</>
} 
