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
const prev = $('.btn-prev');
const random = $(".btn-random");
const repeat = $(".btn-repeat");

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom: false,
    isRepeat : false,
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
            name: "Yến vô hiết",
            singer: "Là Thất Thúc Đây",
            path: "./assets/songs/Yen-Vo-Hiet-La-That-Thuc-Day.mp3",
            image: "./assets/images/yen-ho-hiet.jpg"
        },
        {
            name: "Thế giới rộng lớn vẫn tìm thấy anh",
            singer: "Trình Hưởng",
            path: "./assets/songs/The-gioi-rong-lon-nhu-vay-nhung-van-gap-duoc-anh-Trinh-Huong.mp3",
            image: "./assets/images/the-gioi-rong-lon-nhung-van-tim-thay-anh.jpg"
        },
    ],
    render : function(){
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="">
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
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            _this.render();
            audio.play();
            _this.scrollToSongActive();
        }

        //Prev song
        prev.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.prevSong();
            }
            _this.render();
            audio.play();
            _this.scrollToSongActive();
        }

        //Random song
        random.onclick = function(){
            _this.isRandom = !_this.isRandom;
            random.classList.toggle("active", _this.isRandom);
        }

        //Repeat song
        repeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            repeat.classList.toggle("active", _this.isRepeat);
        }


        //Xử lí khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                next.click();
            }
        }
    },
    scrollToSongActive: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
              behavior: "smooth",
              block: "nearest"
            });
        }, 300);
    },
    loadCurrentSong: function(){
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex > this.songs.length - 1 ){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();  
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();  
    },
    randomSong: function () {
        let newIndex;

        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
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