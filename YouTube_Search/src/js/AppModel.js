import { generateSatics, generateCards } from './AppView';

const state = {
    baseLink: 'https://www.googleapis.com/youtube/v3/',
    endpoint: 'search',
    key: 'AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y',
    type: 'video',
    part: 'snippet',
    maxResults: '15',
    pageToken: '', 
    text: '',
    stringID: '',
};

function search(text) {
    const { baseLink, endpoint, key, type, part, maxResults, pageToken } = state;
    const tokenQuery = `&pageToken=${pageToken}`;

    fetch(`${baseLink}${endpoint}?key=${key}&type=${type}&part=${part}&maxResults=${maxResults}&q=${text}${pageToken && tokenQuery}`)
        .then(res => res.json())
        .then(response => {
            state.pageToken = response.nextPageToken;
            generateSatics(response.items);
            secondQuery();
        })
        .catch(err => console.log(err));
}

function secondQuery() {
    const { baseLink, key, stringID } = state;
    fetch(`${baseLink}videos?key=${key}&id=${stringID}&part=snippet,statistics`)
        .then(res => res.json())
        .then(response => {
            generateCards(response.items);
        })
        .catch(err => console.log(err));
}

export {
    search,
    secondQuery,
    state
};