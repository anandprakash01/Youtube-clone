const menuIcon = document.querySelector(".menu-icon");
const sidebar = document.querySelector(".sidebar");
const container = document.querySelector(".container");
const filters = document.querySelector('.filters');

const videoContainer = document.querySelector('.video-container');

menuIcon.onclick = () => {
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle('large-container')
    filters.classList.toggle('filters-large');
}

// https://www.googleapis.com/youtube/v3/videos?key=AIzaSyC7BBo6iYAoWMdRrL2m0Yc5JsfvWl6Fm0w&part=snippet&chart=mostPopular&maxResult=1&regionCode=IN


// https://www.googleapis.com/youtube/v3/videos?id=VIDEO_ID&key=YOUR_API_KEY&part=statistics
const API_KEY = "AIzaSyC7BBo6iYAoWMdRrL2m0Yc5JsfvWl6Fm0w"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

const video_url = BASE_URL + "/videos?";
const channel_url = BASE_URL + "/channels?"

// const API_URL = video_url + "api_key=" + API_KEY;

fetch(video_url + new URLSearchParams({
    key: API_KEY,
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    maxResults: 200,
    // regionCode: 'IN'

})
).then(res => res.json()).then(data => {
    // console.log(data);
    data.items.forEach(item => {
        getChannelIcon(item);

    });


}).catch(err => console.log(err));


const getChannelIcon = (video_data) => {
    fetch(channel_url + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
        .then(res => res.json())
        .then(data => {
            console.log(data);
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default;
            // console.log(video_data);
            makeVideoCard(video_data);
        })
}

const makeVideoCard = (data) => {
    videoContainer.innerHTML += `
    <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'" >
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail.url}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle} <i class="fa-sharp fa-solid fa-circle-check"></i></p>
                <p>${numFormatter(data.statistics.viewCount)} views</p>
            </div>
        </div>
    </div>
    `
}

function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    else if (num < 900) {
        return num;
    }
}

// search bar

const searchInput = document.querySelector('.search');
const searchBtn = document.querySelector('.search-btn');
let searchlink = "https://www.youtube.com/results?search_query=";
searchBtn.addEventListener('click', () => {
    if (searchInput.value.length) {
        location.href = searchlink + searchInput.value;
    }
})