//------------------------------------- INPUT FORM ---------------------------------//

const checked = $(".cbox");

checked.click(function () {
    if (checked.prop("checked")) {
        $(".add").text("Hit Enter to Search");
    }

    if (!checked.prop("checked")) {
        $(".message").val("");
        $(".add").text("Find a Video");
    }
});
//---------------------------------------- MAIN APP ---------------------------------//

document.addEventListener('DOMContentLoaded', App);

function App() {

    const state = {
        baseLink: 'https://www.googleapis.com/youtube/v3/',
        endpoint: 'search',
        key: 'AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y',
        type: 'video',
        part: 'snippet',
        maxResults: '5',
        pageToken: '', // response -> nextPageToken
        text: '',
        stringID: '',
    };

    const moreVideo = document.querySelector('.more');
    const textInput = document.querySelector('#textInput');
    const slider = document.querySelector('#scroll');

    textInput.addEventListener('keyup', enterHandler);
    moreVideo.addEventListener('click', moreHandler);
    slider.addEventListener('mousedown', handleDown);
    slider.addEventListener('mouseleave', handleLeave);
    slider.addEventListener('mouseup', handleUp);
    slider.addEventListener('mousemove', handleMove);

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

}