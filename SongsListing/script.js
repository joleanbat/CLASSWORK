const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const hiddenId = document.getElementById('songId');

// load songs from localStorage or empty array
let songs = JSON.parse(localStorage.getItem('songs')) || [];

// initial render
renderSongs();

// Form submit handler: add or save edit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Read form values
    const titleInput = document.getElementById('title');
    const urlInput = document.getElementById('url');
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (!title || !url) return; // simple guard

    const editingId = hiddenId.value;

    if (editingId) {
        // Edit mode: find and update the song
        const idNum = Number(editingId);
        const idx = songs.findIndex(s => s.id === idNum);
        if (idx !== -1) {
            songs[idx].title = title;
            songs[idx].url = url;
            songs[idx].dateUpdated = Date.now();
        }
        // exit edit mode
        exitEditMode();
    } else {
        // Add new song
        const song = {
            id: Date.now(),
            title,
            url,
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();
    form.reset();
});

// Save to localStorage and render
function saveAndRender() {
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

// Render table rows
function renderSongs() {
    list.innerHTML = ''; // Clear current list

    // optional: sort by newest first by default
    // songs.sort((a,b) => (b.dateAdded || 0) - (a.dateAdded || 0));

    songs.forEach(song => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${escapeHtml(song.title)}</td>
            <td><a href="${escapeAttr(song.url)}" target="_blank" class="text-info">Watch</a></td>
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

// Delete a song
function deleteSong(id) {
    if (confirm('Are you sure you want to delete this song?')) {
        songs = songs.filter(song => song.id !== id);
        // if we were editing the deleted song, exit edit mode
        if (hiddenId.value && Number(hiddenId.value) === id) {
            exitEditMode();
            form.reset();
        }
        saveAndRender();
    }
}

// Edit a song: populate the form and switch to save mode
function editSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return alert('Song not found');

    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    hiddenId.value = song.id;

    // change submit button to Save mode
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-primary');
    submitBtn.innerHTML = `<i class="fas fa-save"></i> Save`;
    // focus title input
    document.getElementById('title').focus();
}

// Revert form to Add mode
function exitEditMode() {
    hiddenId.value = '';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-success');
    submitBtn.innerHTML = `<i class="fas fa-plus"></i> Add`;
}

// small helpers to avoid injection via values (good practice)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Expose functions to global scope so the inline onclick attributes work
window.editSong = editSong;
window.deleteSong = deleteSong;
