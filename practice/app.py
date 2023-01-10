import json
from urllib.request import urlopen
from random import shuffle
from flask import Flask, render_template
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/")
def index():
    """初期画面を表示します."""
    return render_template("index.html")

@app.route("/api/recommend_article")
def api_recommend_article():
    """はてブのホットエントリーから記事を入手して、ランダムに1件返却します."""

    """
        **** ここを実装します（基礎課題） ****

        1. はてブのホットエントリーページのHTMLを取得する
        2. BeautifulSoupでHTMLを読み込む
        3. 記事一覧を取得する
        4. ランダムに1件取得する
        5. 以下の形式で返却する.
            {
                "content" : "記事のタイトル",
                "link" : "記事のURL"
            }
    """
    with urlopen("http://feeds.feedburner.com/hatena/b/hotentry") as res:
        html = res.read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    items = soup.select("item")
    shuffle(items)
    item = items[0]
    print(item)
    return json.dumps({
        "content" : item.find("title").string,
        # "link" : item.find("link").string
        "link": item.get('rdf:about')
    })


@app.route("/api/xxxx")
def api_xxxx():
    """
        **** ここを実装します（発展課題） ****
        ・自分の好きなサイトをWebスクレイピングして情報をフロントに返却します
        ・お天気APIなども良いかも
        ・関数名は適宜変更してください
    """
    with urlopen("https://my-best.com/155") as res:
        html = res.read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    # items = soup.select("div._cDEzb_noop_3Xbw5")
    items = soup.select("div.p-contents-item-part")
    shuffle(items)
    item = items[0]
    print(item.find("div", class_="p-contents-item-part__link--product"))
    # print(item.find("div", class_="c-image--in-carousel").find("img").get('src'))
    return json.dumps({
        "content" : item.find("span", class_="p-contents-item-part__header-name").get_text(),
        # "link" : item.find("link").string
        # "link": item.string
        "link": item.find("a", class_="c-shops__button").get('href'),
        # "img": item.find("img").get('src')
    })

if __name__ == "__main__":
    app.run(debug=True, port=5004)
