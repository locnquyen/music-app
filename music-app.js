/**
 * 1. Render songs
 * 2. Croll top
 * 3. Play / pause / seek
 * 4.  CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repet when music ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('.playlist');
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const progress = $('#progress');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Bên Trên Tầng Lầu',
            singer: "Tăng Duy Tân",
            path: "./assets/mucsics/BenTrenTangLau.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/share/2022/06/09/2/1/a/4/1654766694296.jpg"
        },
        {
            name: 'Kẻ Theo Đuổi Ánh Sáng',
            singer: "Huy Vạc",
            path: "./assets/mucsics/KeTheoDuoiAnhSang-HuyVac.mp3",
            image: "./assets/img/ketheoduoianhsang.jpeg"
        },
        {
            name: 'Đế Vương',
            singer: "Đình Duõng",
            path: "./assets/mucsics/DeVuong.mp3",
            image: "./assets/img/devuong.jpeg"
        },
        {
            name: 'Người Ta Nói',
            singer: "Ưng Hoàng Phúc",
            path: "./assets/mucsics/NguoiTaNoi.mp3",
            image: "./assets/img/nguoitanoi.jpeg"
        },
        {
            name: 'Chiều Hôm Ấy',
            singer: "Jaykii",
            path: "./assets/mucsics/ChieuHomAy.mp3",
            image: "./assets/img/chieuhomay.jpeg"
        },
        {
            name: 'Sắp 30',
            singer: "Trịnh Đình Quang",
            path: "./assets/mucsics/Sap30.mp3",
            image: "./assets/img/sap30.jpeg"
        },
        {
            name: 'Không Bằng',
            singer: "Huy Vạc",
            path: "./assets/mucsics/KhongBang.mp3",
            image: "./assets/img/khongbang-huyvac.jpeg"
        },
        {
            name: 'Không Thể Đến Với Nhau',
            singer: "Huy Vạc",
            path: "./assets/mucsics/Sap30.mp3",
            image: "./assets/img/khongthedenvoinhau.jpeg"
        },
        {
            name: 'Tháng 4 Lời Tỏ Tình Chân Thật',
            singer: "Huy Vạc",
            path: "./assets/mucsics/Thang4LoiToTinhChanThat.mp3",
            image: "./assets/img/thang4loitotinhchanthat.jpeg"
        },
        {
            name: 'Chi Vi Qua Yeu Em',
            singer: "Huy Vạc",
            path: "./assets/mucsics/ChiViQuaYeuEm.mp3",
            image: "./assets/img/chiviquayeuem-huyvac.jpeg"
        },
        {
            name: 'Chẳng Thể Nói Với Người',
            singer: "Huy Vac",
            path: "./assets/mucsics/ChangTheNoiVoiNguoi.mp3",
            image: "./assets/img/changthenoivoinguoi-huyvac.jpeg"
        }


    ],
    //render song
    render: function () {
        const htmls = this.songs.map((song, index) => `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index='${index}'>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `);
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    // handle all events
    handleEvents: function () {
        // xử lý phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            //lấy chiều cao theo trục Y
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // xư lý khi play
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //when audio playing
        audio.onplay = function () {
            player.classList.add('playing');
            app.isPlaying = true;
            cdThumbAnimate.play();
        }
        //when audio pausing
        audio.onpause = function () {
            player.classList.remove('playing');
            app.isPlaying = false;
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        //xử lý khi tua bài hát thay
        progress.onchange = function (e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        }
        // xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        });
        //nextSong
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        //prev song
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        //phát nhạc ngẫu nhiên
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);

        }
        //xử lý next song khi audio ended
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.onclick();
            }
        }
        //xử lý lặp lại bài hát
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);

        }
        //lắng nghe hành vi click vào play list
        playList.onclick = function (e) {
            let songNode = e.target.closest('.song:not(.active)')
            //khi click vào từng bài hát hoặc option của nó thì đk đúng
            if (songNode || e.target.closest('.option')) {
                //handle click in song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
                //handle click in option
                if(e.target.closest('.option')){

                }

            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path
    },
    //khi chuyển tiếp bài
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    //khi lùi bài
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * app.songs.length);
            console.log(newIndex);
        } while (newIndex === this.currentIndex)
        console.log(this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300)
    },
    start: function () {
        //define properties of object
        this.defineProperties();
        //listen / handle events (DOM Events)
        this.handleEvents();
        //load current songs 
        this.loadCurrentSong();
        this.render();
    }
}
//run app
app.start();