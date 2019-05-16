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
//------------------------------ GENERATION FUNCTION -------------------------------//    

function generateSatics(items) {
    const ID = [];
    for (let a = 0; a < items.length; a++) {
        const videoTest = items[a].id.videoId;
        ID.push(videoTest);
        state.stringID = ID.join(',');
        console.log(state.stringID);
    }
}

function generateCards(items) {


    const temp = document.querySelector('#card_template');
    const wrapper = document.querySelector('.cards');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < items.length; i++) {
        const newArticle = document.importNode(temp.content, true);

        const title = newArticle.querySelector('.title');
        title.innerHTML = items[i].snippet.title;

        const imgLink = items[i].snippet.thumbnails.high.url;

        const prevImage = newArticle.querySelector('#prevImage');
        prevImage.src = imgLink;

        const info = newArticle.querySelector('.info');
        info.innerHTML = items[i].snippet.description; //or .split(' ').slice(0, 3);

        const time = newArticle.querySelector('.time');
        time.innerHTML = items[i].snippet.publishedAt.slice(0, 10);

        const watchVideo = newArticle.querySelector('.btn');
        watchVideo.href = `https://www.youtube.com/watch?v=${items[i].id}`;

        const views = newArticle.querySelector('.views');
        views.innerHTML = items[i].statistics.viewCount;

        const likes = newArticle.querySelector('.likes');
        likes.innerHTML = items[i].statistics.likeCount;

        fragment.appendChild(newArticle);

    }
    wrapper.appendChild(fragment);
}
document.addEventListener('DOMContentLoaded', App);