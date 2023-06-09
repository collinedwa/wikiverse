import React, {useState} from 'react';
import { Author } from './Author';

export const AuthorList = ({authors, fetchAuthors, setAuthors}) => {
	
	return <>
		{
			authors.map((author, idx) => <Author author={author} key={idx} fetchAuthors={fetchAuthors} setAuthors={setAuthors}/>)
		}
	</>
} 
