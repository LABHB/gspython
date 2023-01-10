
/**
 * 音声認識のインスタンス.
 */
let recognition;


/**
 * サーバー通信を行う.
 */
function api(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function (e) {
            if (this.readyState === 4 && this.status === 200) {
                resolve(this.responseText);
            }
        }
        xhr.send();
    });
}

/**
 * 開始ボタンを押した時のイベント.
 */
function handleStartButtonClick() {

    // 音声認識のインスタンスを生成します.
    recognition = new webkitSpeechRecognition();

    // 言語は日本語にします.
    recognition.lang = 'ja';

    // 音声認識開始時のイベント.
    recognition.onstart = function() {
        console.log('onstart');
        document.querySelector('.js-btn-group').classList.add('--recording');
    };

    // 音声認識エラー発生時のイベント.
    recognition.onerror = function(event) {
        console.log('onerror:', event.error);
        document.querySelector('.js-btn-group').classList.remove('--recording');
    };

    // 音声認識終了時のイベント.
    recognition.onend = function() {
        console.log('onend');
        document.querySelector('.js-btn-group').classList.remove('--recording');
    };

    // 音声認識の結果を取得した時のイベント.
    recognition.onresult = event => {
      let text = event.results.item(0).item(0).transcript;
      let isFinal = event.results.item(0).isFinal;
      console.log('onresult: ', text, event.results);

      if (!isFinal) {
        return;
      }

      if (text.indexOf('イヤホン') !== -1) {
        // ニュースだったら、API経由でおすすめ記事を取得する.
        // showRecommendArticle();
        showXXX();
      
      } else {
        // ニュース以外はわからないよ〜.
        let synthes = new SpeechSynthesisUtterance('ごめんなさい、イヤホン以外はわかりません');
        synthes.lang = "ja-JP";
        speechSynthesis.speak(synthes);
      }
    };

    // 音声認識を開始します.
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.start();
}

/**
 * 停止ボタンを押した時のイベント.
 */
function handleStopButtonClick() {
    if (recognition) {
        recognition.stop();
    }
}

/**
 * API経由でおすすめニュースを取得して、音声で発します.
 */
function showRecommendArticle() {

    api('/api/recommend_article').then(response => {
        let { content, link } = JSON.parse(response);
        console.log(content);

        content = content.split("-")[0];

        let synthes = new SpeechSynthesisUtterance(content);
        synthes.lang = "ja-JP";
        speechSynthesis.speak(synthes);

        document.getElementById('text').innerHTML = `<a href="${link}">${content}</a>`;
    });
}
function showXXX() {

    api('/api/xxxx').then(response => {
        // let { content, link , img } = JSON.parse(response);
        let { content, link} = JSON.parse(response);
        console.log(content);
        // console.log(img);

        content = content.split("-")[0];

        let synthes = new SpeechSynthesisUtterance(content);
        synthes.lang = "ja-JP";
        speechSynthesis.speak(synthes);

        document.getElementById('text').innerHTML = `<a href="${link}">${content}</a>`;
        // document.getElementById('text').innerHTML = `<a href="${link}">${content}"ああ"</a><img src="https://img.my-best.com/product_images/8c4f1db41426702e66f4554eff2d873d.jpeg?ixlib=rails-4.2.0&q=70&lossless=0&w=640&h=640&fit=clip&s=f5ac75ff6a9327b806c1528400dc4733">`;
    });
}

/**
 * アプリ起動時に、説明を表示します.
 */
function startIntro() {

    let elm = document.getElementById('text');

    return new Promise((resolve, reject) => {

        // let texts = "「おすすめニュースを教えて」と聞いてみてください。".split('');
        let texts = "「おすすめイヤホンを教えて」と聞いてみてください。".split('');

        function showMessage(texts, cb) {
            if (texts.length === 0) {
                return cb();
            }
            let ch = texts.shift();
            elm.innerHTML += ch;
            setTimeout(() => {
                showMessage(texts, cb);
            }, 120);
        }

        elm.innerHTML = '';
        showMessage(texts, resolve);
    });
}

/**
 * アプリを起動します.
 */
window.addEventListener('DOMContentLoaded', () => {

    // アプリの説明を行います.
    startIntro().then(() => {

        // ボタンの表示と挙動
        document.querySelector('.js-btn-group').classList.add('--visible');
        document.getElementById('startButton').onclick = handleStartButtonClick;
        document.getElementById('stopButton').onclick = handleStopButtonClick;
    });
});