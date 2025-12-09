const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const songIdInput = document.getElementById('songId');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const ratingInput = document.getElementById('rating');
const searchInput = document.getElementById('search');
const sortOptions = document.getElementById('sortOptions');
const toggleViewBtn = document.getElementById('toggleViewBtn');
const tableView = document.getElementById('tableView');
const cardsView = document.getElementById('cardsView');
const viewIcon = document.getElementById('viewIcon');

// Load songs from localStorage or initialize empty array
let songs = JSON.parse(localStorage.getItem('songs')) || [];
let currentView = 'table'; // 'table' or 'cards'
let currentSort = 'dateAdded';

// --- Utility Functions ---

/**
 * Extracts the YouTube Video ID from a given URL.
 * @param {string} url - The YouTube URL.
 * @returns {string | null} The video ID or null if not found.
 */
function getYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|\/(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return (match && match[1].length === 11) ? match[1] : null;
}

// --- CRUD Operations ---

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value;
    const url = urlInput.value;
    const rating = parseInt(ratingInput.value, 10);
    const videoId = getYouTubeId(url);
    const id = songIdInput.value;

    if (!videoId) {
        alert('Invalid YouTube URL.');
        return;
    }

    if (id) {
        // Update existing song
        updateSong(parseInt(id), title, url, rating, videoId);
    } else {
        // Add new song
        const newSong = {
            id: Date.now(),
            title: title,
            url: url,
            rating: rating,
            videoId: videoId,
            dateAdded: Date.now()
        };
        songs.push(newSong);
    }

    saveAndRender();
    form.reset();
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add'; // Reset button text
    songIdInput.value = ''; // Clear ID after operation
    ratingInput.value = 5; // Reset rating value
});

function updateSong(id, title, url, rating, videoId) {
    const index = songs.findIndex(song => song.id === id);
    if (index !== -1) {
        songs[index] = {
            ...songs[index],
            title,
            url,
            rating,
            videoId
        };
    }
}

window.editSong = function (id) {
    const songToEdit = songs.find(song => song.id === id);
    if (songToEdit) {
        // Populate the form fields
        songIdInput.value = songToEdit.id;
        titleInput.value = songToEdit.title;
        urlInput.value = songToEdit.url;
        ratingInput.value = songToEdit.rating;
        submitBtn.innerHTML = '<i class="fas fa-sync"></i> Update'; // Change button text
    }
}

window.deleteSong = function (id) {
    if (confirm('Are you sure you want to delete this song?')) {
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

// --- Save and Render ---

function saveAndRender() {
    localStorage.setItem('songs', JSON.stringify(songs));
    renderAll();
}

// Function to call on page load (initial render)
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
});

// --- Filtering, Sorting, and View Management ---

function getSortedAndFilteredSongs() {
    // 1. Filter
    const searchTerm = searchInput.value.toLowerCase();
    let filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm)
    );

    // 2. Sort
    filteredSongs.sort((a, b) => {
        if (currentSort === 'title') {
            return a.title.localeCompare(b.title);
        } else if (currentSort === 'rating') {
            // Sort by rating descending (higher rating first)
            return b.rating - a.rating;
        } else if (currentSort === 'dateAdded') {
            // Sort by dateAdded descending (newest first)
            return b.dateAdded - a.dateAdded;
        }
        return 0;
    });

    return filteredSongs;
}

function renderAll() {
    const dataToRender = getSortedAndFilteredSongs();

    list.innerHTML = ''; // Clear table
    cardsView.innerHTML = ''; // Clear cards

    if (currentView === 'table') {
        renderSongs(dataToRender);
        tableView.classList.remove('d-none');
        cardsView.classList.add('d-none');
        viewIcon.className = 'fas fa-th-large';
    } else {
        renderCards(dataToRender);
        tableView.classList.add('d-none');
        cardsView.classList.remove('d-none');
        viewIcon.className = 'fas fa-list';
    }
}

function renderSongs(songsToDisplay) {
    songsToDisplay.forEach(song => {
        const row = document.createElement('tr');
        const thumbnailUrl = `https://img.youtube.com/vi/${song.videoId}/default.jpg`;

        row.innerHTML = `
            <td><img src="${thumbnailUrl}" class="youtube-thumb" alt="${song.title} thumbnail"></td>
            <td>${song.title}</td>
            <td><a href="#" onclick="playVideo('${song.videoId}', '${song.title.replace(/'/g, "\\'")}')" class="text-info">Watch</a></td>
            <td>${song.rating}/10</td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}

function renderCards(songsToDisplay) {
    songsToDisplay.forEach(song => {
        const col = document.createElement('div');
        col.className = 'col';

        const thumbnailUrl = `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`;

        col.innerHTML = `
            <div class="card h-100 bg-secondary border-info">
                <img src="${thumbnailUrl}" class="card-img-top card-img-top-custom" alt="${song.title} thumbnail">
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text">Rating: <strong>${song.rating}/10</strong></p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-info btn-sm" onclick="playVideo('${song.videoId}', '${song.title.replace(/'/g, "\\'")}')">
                            <i class="fas fa-play"></i> Play
                        </button>
                        <div>
                            <button class="btn btn-warning btn-sm me-2" onclick="editSong(${song.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteSong(${song.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cardsView.appendChild(col);
    });
}

// --- Event Listeners ---

// Search
searchInput.addEventListener('input', renderAll);

// Sort (Radio Buttons)
sortOptions.addEventListener('change', (e) => {
    if (e.target.name === 'sort-by') {
        currentSort = e.target.value;
        renderAll();
    }
});

// Toggle View
toggleViewBtn.addEventListener('click', () => {
    currentView = currentView === 'table' ? 'cards' : 'table';
    renderAll();
});

// --- Modal/Player Functionality ---

const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
const youtubePlayer = document.getElementById('youtubePlayer');
const modalTitle = document.getElementById('videoModalLabel');

window.playVideo = function (videoId, title) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modalTitle.textContent = title;
    youtubePlayer.src = embedUrl;
    videoModal.show();
}

// Stop video playback when modal is closed
document.getElementById('videoModal').addEventListener('hidden.bs.modal', function () {
    youtubePlayer.src = ''; // This stops the video
});

// Ensure initial rendering on load
renderAll();