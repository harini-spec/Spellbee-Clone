words_list = ["DEMON", "DENY", "DONE",
            "DONEE", "DONNED", "DOYEN",
            "DOYENNE", "DYNE", "EMEND",
            "EMENDED", "ENDED", "ENEMY",
            "HOMONYM", "HOMONYMY", "HONE",
            "HONED", "HONEY", "HONEYED",
            "HONEYMOON", "HONEYMOONED",
            "HYMEN", "HYMN", "MEND",
            "MENDED", "MONDO", "MONEY",
            "MONEYED", "MONEYMEN", "MONO",
            "MONONYM", "MOON", "MOONED",
            "MOONY", "NEED", "NEEDED",
            "NEEDY", "NENE", "NEON",
            "NODDED", "NODE", "NONE",
            "NOON", "ODEON", "OMEN",
            "YENNED", "YEOMEN", "YOND"]

remarks = {"Beginner": 0, "Good Start": 4, "Moving Up": 11, "Good": 17, "Solid": 32, "Nice": 53, "Great": 85, "Amazing": 107, "Genius": 149}
score = 0

Panagram = ["HONEYMOONED"]
characters = ['H', 'O', 'N', 'E', 'Y', 'D', 'M']
mandatory_char = 'N'
max_chars = 15
found_words = []

const loadRemarks = () => {
    var remark_container = document.querySelector(".remark-container");

    var remark_val = "";
    var count = -1;
    for (const [key, value] of Object.entries(remarks)) {
        if (value <= score) {
            remark_val = key;
            count++;
        } else {
            break;
        }
    }

    var cont_html = `<div class="line"></div>
                     <div class="rank">${remark_val}</div>`;

    for (var i = 0; i < Object.keys(remarks).length; i++) {
        if (i == count)
            cont_html += `<div class="current_score">${score}</div>`;
        else if (i == Object.keys(remarks).length - 1 && i != count)
            cont_html += `<div class="last"></div>`;
        else
            cont_html += `<div class="score"></div>`;
    }
    remark_container.innerHTML = cont_html;
}

const loadToastr = () => {
    toastr.options = 
    {"positionClass": "toast-top-center",
    "showDuration": "5000"}
}

const shuffle = () => { 
    var array_wo_mandatory_char = []
    characters.forEach(element => {
        if(element != mandatory_char)
            array_wo_mandatory_char.push(element)
    });
    for (let i = array_wo_mandatory_char.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array_wo_mandatory_char[i], array_wo_mandatory_char[j]] = [array_wo_mandatory_char[j], array_wo_mandatory_char[i]]; 
    } 
    return array_wo_mandatory_char; 
  }; 

const scrambleLetters = () => {
    characters = shuffle()
    var letter_cont = document.querySelector(".letters-container")
    var buttons = letter_cont.getElementsByTagName("button")
    console.log(buttons)
    var j = 0
    for(var i=0;i<buttons.length;i++)
    {
        if(i!=3){
            buttons[i].innerHTML = characters[j]
            buttons[i].id = characters[j]
            j++;
        }
    }
}

const checkWord = () => {
    var input_container = document.querySelectorAll(".inp")
    var word = ""
    for(var i=0;i<input_container.length;i++)
        word += input_container[i].innerHTML

    var answers = document.querySelectorAll(".correct-word")

    if(word.length<=3)
        {
            toastr.info("Too Short!", "", {"iconClass": 'toast'})
            document.querySelector(".letters").innerHTML = ""
            return
        }

    if(words_list.includes(word) && !found_words.includes(word)){
        var val = document.querySelector(".found_words")
        var div = `<div class="correct-word">${word}<hr></div>`
        val.innerHTML += div
        found_words.push(word)
        score += word.length
        loadRemarks()

        if(answers.length == 0)
            document.querySelector(".header").innerHTML = "You have found 1 word"
        else
        {
            var header_container = document.querySelector(".header")
            var header_val = header_container.innerHTML.split("You have found ")
            var count = answers.length+1
            var final_header_val = "You have found " + count + " words"
            document.querySelector(".header").innerHTML = final_header_val
        }

        if(Panagram.includes(word))
            toastr.info("Panagram!", "", {"iconClass": 'toast'})
        else
            toastr.info("Nice", "", {"iconClass": 'toast'})
        document.querySelector(".letters").innerHTML = ""

    }
    else if(found_words.includes(word)){
        toastr.info("Already found!", "", {"iconClass": 'toast'})
        document.querySelector(".letters").innerHTML = ""
    }
    else{
        toastr.info("Bad Letters", "", {"iconClass": 'toast'})
        document.querySelector(".letters").innerHTML = ""
    }
}

const enterLetter = (e, condn) => {
    var input_box = document.querySelector(".letters")
    var classname = ""
    var input_val = document.querySelectorAll(".inp")
    if(input_val.length>max_chars){
        toastr.info("Too long", "", {"iconClass": 'toast'})
        document.querySelector(".letters").innerHTML = ""
        return 
    }
    if(e == mandatory_char)
        classname = "mandatory-character"
    else if(characters.includes(e))
        classname = "valid"
    else
        classname = "invalid"
    if(condn == "id")
        input_box.innerHTML += `<span class="inp ${classname}">${e.id}</span>`
    else 
        input_box.innerHTML += `<span class="inp ${classname}">${e}</span>`
}


const deleteLetter = () => {
    var input_val = document.querySelectorAll(".inp")
    if(input_val.length!=0)
        input_val[input_val.length-1].remove()
}

document.addEventListener("keydown", function(e){
    var val = e.key.toUpperCase()
    let regex = /^[a-zA-Z]+$/
    if(regex.test(val) && (val=="BACKSPACE" || val=="ENTER" || val.length==1)){
        if(val=="BACKSPACE")
            deleteLetter()
        else if(val=="ENTER")
            checkWord()
        else
            enterLetter(val, "val")
    }
})