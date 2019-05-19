import { state } from './AppModel';
import { $ } from 'jquery';

function inputFunction() {
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
}


function generateSatics(items) {
    const ID = [];
    for (let a = 0; a < items.length; a++) {
        const videoTest = items[a].id.videoId;
        ID.push(videoTest);
        state.stringID = ID.join(',');
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
        info.innerHTML = items[i].snippet.description; 

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

export {
    inputFunction,
    generateSatics,
    generateCards
};
