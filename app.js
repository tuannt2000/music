const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const next = $('.btn-next');
const prev = $('btn-prev');

const app = {
    currentIndex : 0,
    isPlaying : false,
    songs: [
        {
          name: "Yêu",
          singer: "Min",
          path: "./assets/songs/Yeu-Min.mp3",
          image: './assets/images/yeu.jfif'
        },
        {
            name: "One Call Away",
            singer: "Charlie Puth",
            path: "./assets/songs/One-Call-Away-Remix-Charlie-Puth-Tyga.mp3",
            image: "./assets/images/one-call-away.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "https://mp3.vlcmusic.com/download.php?track_id=34213&format=320",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "https://mp3.vlcmusic.com/download.php?track_id=34213&format=320",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "https://mp3.vlcmusic.com/download.php?track_id=34213&format=320",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
    ],
    render : function(){
        const htmls = this.songs.map((song, index) => {
            return `<div class="song" data-index="">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        })

        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function(){
        Object.defineProperty(this , 'currentSong' ,{
            get : function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents : function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //CD quay
        const cdThumbAnimate = cdThumb.animate([{
            transform : 'rotate(-360deg)'
        }],{
            duration : 10000,
            iterations : Infinity,
        });
        cdThumbAnimate.pause();

        //Xử lí phóng to thu nhỏ ảnh
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth > 0? newCdWidth/cdWidth : 0;
        }

        //Xử lí click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{               
                audio.play();        
            }
        }

        //Audio chạy
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }

        //Audio dừng
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xử lí khi tua song
        progress.oninput = function(){
            const seekTime = audio.duration*this.value/100;
            audio.currentTime = seekTime;
        }

        //Next song
        next.onclick = function(){
            _this.nextSong();
            audio.play();
        }
    },
    loadCurrentSong: function(){
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        this.loadCurrentSong();  
    },
    prevSong: function(){
        this.currentIndex--;
        this.loadCurrentSong();  
    },
    start: function(){
        //Định nghĩa thuộc tính cho object
        this.defineProperties();

        //Lấy thông tin song đang chạy
        this.loadCurrentSong();

        //Xử lí các sự kiện
        this.handleEvents();

        //In ra danh mục songs
        this.render();
    }
}

app.start();