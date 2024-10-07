let currentTrack = 0;
let playlist = [];

const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const trackTitle = document.getElementById('track-title');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const uploadForm = document.getElementById('upload-form');
const uploadStatus = document.getElementById('upload-status');

// Оновлюємо трек
function loadTrack(index) {
    const trackTitleText = playlist[index].Title ? playlist[index].Title : 'Untitled Track';  // Використовуємо поле Title з великої літери
    console.log(trackTitleText);  // Виводимо назву для перевірки
    audioSource.src = playlist[index].file.url;
    trackTitle.textContent = "Now Playing: " + trackTitleText;  // Якщо немає назви, виводимо 'Untitled Track'
    audioPlayer.load();
}

// Отримуємо плейліст із Back4App
function fetchPlaylist() {
    fetch('https://parseapi.back4app.com/classes/AudioFiles', {
        method: 'GET',
        headers: {
            'X-Parse-Application-Id': '84eSDw9LAOTibokLoGBilalpv6nsT1LkIK89S5Oz',
            'X-Parse-REST-API-Key': 'TnkIDC0lt0JC76YBoQaqlgwrvoGtLUwQsADeLjXt'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Додаємо виведення даних для перевірки
        playlist = data.results;  // results містить масив аудіофайлів із Back4App
        if (playlist.length > 0) {
            loadTrack(currentTrack);
        }
    })
    .catch(error => console.error('Error fetching playlist:', error));
}

// Завантаження нового файлу
uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;  // Виправлено id для поля вводу назви треку
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    // Перевіряємо, що файл має формат .mp3
    if (file && file.name.endsWith('.mp3')) {
        const formData = new FormData();
        formData.append("file", file);

        // Завантажуємо файл на Back4App
        fetch('https://parseapi.back4app.com/files/' + file.name, {
            method: 'POST',
            headers: {
                'X-Parse-Application-Id': '84eSDw9LAOTibokLoGBilalpv6nsT1LkIK89S5Oz',
                'X-Parse-REST-API-Key': 'TnkIDC0lt0JC76YBoQaqlgwrvoGtLUwQsADeLjXt'
            },
            body: formData
        })
        .then(response => response.json())
        .then(fileData => {
            // Після успішного завантаження файлу зберігаємо інформацію в базі даних
            const fileUrl = fileData.url;
            return fetch('https://parseapi.back4app.com/classes/AudioFiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id': '84eSDw9LAOTibokLoGBilalpv6nsT1LkIK89S5Oz',
                    'X-Parse-REST-API-Key': 'TnkIDC0lt0JC76YBoQaqlgwrvoGtLUwQsADeLjXt'
                },
                body: JSON.stringify({
                    Title: title,  // Правильне використання поля Title з великої літери
                    file: {
                        "__type": "File",
                        "name": fileData.name,
                        "url": fileUrl
                    }
                })
            });
        })
        .then(response => response.json())
        .then(() => {
            uploadStatus.textContent = "File uploaded successfully!";
            fetchPlaylist();  // Оновлюємо плейліст
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            uploadStatus.textContent = "Failed to upload file.";
        });
    } else {
        uploadStatus.textContent = "Only MP3 files are allowed.";
    }
});

// Викликаємо функцію для отримання плейліста при завантаженні сторінки
fetchPlaylist();

// Перехід на попередній трек
prevButton.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    audioPlayer.play();  // Відтворюємо після зміни треку
});

// Перехід на наступний трек
nextButton.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    audioPlayer.play();  // Відтворюємо після зміни треку
});
