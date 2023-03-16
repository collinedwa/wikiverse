import React, {useState} from 'react';
import { Page } from './Page';

export const PagesList = ({pages, setPages, fetchPages, searchingPage, setSearchingPage}) => {
	
	return <>
		{
			pages.map((page, idx) => <Page page={page} key={idx} pages={pages} 
			setPages={setPages} fetchPages={fetchPages} searchingPage={searchingPage}
			setSearchingPage={setSearchingPage}/>)
		}
	</>
} 
