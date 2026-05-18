function GetRandomNum(Min,Max){
    var Range = Max - Min
    var Rand = Math.random()
    return(Min + Math.round(Rand * Range))
}

quotes = new Array
quotes[0] = "これは最初の語録です！"
quotes[1] = "🙋👉🦠❓　🇳👉🥩❓　🪙👉😢　🕳️👉👁️‍🗨️❓"
quotes[2] = "🔍YTPMV　作り方"
quotes[3] = "*爆弾投下*"
quotes[4] = "ご来店をお待ちしております。"
quotes[5] = "🔍絵　描き方"
quotes[6] = "マホイップかわいい"
quotes[7] = "#アリルズゴムを許すな"
quotes[8] = "#ぐみひよはMisskey界隈人の砦"
quotes[9] = "まほ？"
quotes[10] = "イミテイトポケモン　あなたにリーフィアは見破れるか？"
quotes[11] = "波形海苔"
quotes[12] = "循環循環循環循環循環循環循環循環循環循環循環循環循環循環循環循環循環"
quotes[13] = "青鳥の反意語は黒叉です（噓）"
quotes[14] = "🔥🔥🔥あつい！！！🔥🔥🔥"
quotes[15] = "霜音ルスかわいい"
quotes[16] = "日本語食べません"
quotes[17] = "ニーハオ！"
quotes[18] = "界隈人「それは…暗号ですか？」"
quotes[19] = "绯歌留夜かわいい"
quotes[20] = "霰椰【曖昧さ回避】"
quotes[21] = "ナザールかわいい"
quotes[22] = "らんらんらんらららららららん"
quotes[23] = "ネコと和解せよ"
quotes[24] = "眠気"
quotes[25] = "もし誰か界隈ケモニャー合作の主催をしたい人がいたらDMください"
quotes[26] = "あ"
quotes[27] = "兔爷かわいい"
quotes[28] = "卵チャーハン"
quotes[29] = "形而上たる精霊よ、でんでらりゅうばで断ち切った。"
quotes[30] = "微软大战代码"
quotes[31] = "丸吞み　最高"
quotes[32] = "楽しみだなぁ...♪"
quotes[33] = "界隈人「それは…教育文字ですか？」"
quotes[34] = "🔍曲　作り方"
quotes[35] = "You've Got Mail!"
var num = GetRandomNum(0,quotes.length-1);
var quote = quotes[num]
document.write(quote)