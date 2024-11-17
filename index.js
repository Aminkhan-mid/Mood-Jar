import {v4 as uuidv4} from "https://jspm.dev/uuid"


const moodJarData = JSON.parse(localStorage.getItem('MOODS')) || [
    {
        moods:'😁',
        likes:0,
        archived:0,
        textarea:"What if clouds had feelings? Would they cry because of the pressure to rain, or smile because of the joy they bring? Today, I’m trying to be more like a cloud: soft, floating through, and unbothered by gravity.",
        isLiked: false,
        isArchived:false,
        uuid:uuidv4(),
        createdAt:new Date().toISOString()
    }
]


const textInp = document.getElementById("text-inp")
const emojiInp = document.getElementById('emoji-id')
document.addEventListener("click", function(e){
    if(e.target.id === 'main-btn'){
        handTextValue()
    } else if(e.target.dataset.star){
        handleStarIcon(e.target.dataset.star)
    } else if(e.target.dataset.delete){
        handleDeleteMood(e.target.dataset.delete)
    } else if(e.target.dataset.archived){
        handleArchivedIcon(e.target.dataset.archived)
    }
})

function handTextValue(){
    if(textInp.value){
        moodJarData.unshift(
            {
                moods:emojiInp.value,
                likes:0,
                archived:0,
                textarea:textInp.value,
                isLiked: false,
                isArchived:false,
                uuid:uuidv4(),
                createdAt: new Date().toISOString()
            }
        )
    }
    localStorage.setItem("MOODS", JSON.stringify(moodJarData))
    textInp.value = ''
   render()
}

function handleStarIcon(star){
    const tragetedStar = moodJarData.filter(function(mood){
        return mood.uuid === star
    })[0]
    if(tragetedStar.isLiked){
        tragetedStar.likes--
    } else{
        tragetedStar.likes++
    }
    tragetedStar.isLiked = !tragetedStar.isLiked
    localStorage.setItem("MOODS", JSON.stringify(moodJarData))
    render()
}


function handleDeleteMood(del){
    const deleteMood = moodJarData.filter(function(mood){
        return mood.uuid === del
    })
    if(deleteMood !== -1){
        moodJarData.splice(deleteMood, 1)
        localStorage.setItem('MOODS', JSON.stringify(moodJarData))
        render()
    }
}

function handleArchivedIcon(arch){
    const tragetedArch = moodJarData.filter(function(later){
        return later.uuid === arch
    })[0]
    if(tragetedArch.isArchived){
        tragetedArch.archived--
    } else {
        tragetedArch.archived++
    }
    tragetedArch.isArchived = !tragetedArch.isArchived
    localStorage.setItem("MOODS", JSON.stringify(moodJarData))
    render()
}

function getTimeAgo(createdAt){
    const now = new Date()
    const createdDate = new Date(createdAt)
    const diffInMs = now - createdDate
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if(diffInDays === 0){
        return "created today"
    } else if(diffInDays === 1){
        return "created 1 day ago"
    } else {
        return `created ${diffInDays} days ago`
    }
}

function countEmojiOccurrences(){
    let emojiCount = {}

    moodJarData.forEach(function(mood){
        const emoji = mood.moods
        if(emojiCount[emoji]){
            emojiCount[emoji]++
        } else {
            emojiCount[emoji] = 1
        }
    })
    return emojiCount
}
document.addEventListener("DOMContentLoaded", function(){
    const emojiSpans = document.querySelectorAll('.emojies span')
    const emojiCounts = countEmojiOccurrences()

    emojiSpans.forEach(function(span){
        const emoji = span.getAttribute('value')
        const count = emojiCounts[emoji] || 0
        showEmojiCount(emoji, count)
        // Attach the event listener to the current span element inside the loop
        span.addEventListener('mouseenter', () => {
            const emoji = span.getAttribute('value')  // Get the emoji from the span
            const count = emojiCounts[emoji] || 0
            showEmojiCount(emoji, count)
        });
    })
})
function showEmojiCount(emoji, count){
    const countDisplay = document.getElementById("emoji-count-display")
    countDisplay.textContent = `${emoji} has been used ${count} times`
    countDisplay.style.display = 'block'
    countDisplay.style.visibility = 'visible'
    countDisplay.style.opacity = 1
}


function quotesDisplay(){
    const quotes = [
        "Happiness is not something ready-made. It comes from your own actions. – Dalai Lama",
        "Sometimes, the smallest step in the right direction ends up being the biggest step of your life. – Unknown",
        "It’s okay to not feel okay. Just don’t let it stop you from trying again tomorrow. – Unknown",
       "The sun will rise, and we will try again. – Morgan Harper Nichols",
        "Every storm runs out of rain, just like every dark night turns into day. – Gary Allan"
    ]
   const random = Math.floor(Math.random()*quotes.length)
    document.getElementById("quotes").textContent = quotes[random]
}
quotesDisplay()

setInterval(quotesDisplay, 3600000)

function getMoodLoop(){
    let moodFeed = ""
    moodJarData.forEach(function(mood){

        
        let starIcon = ''
        let backStar = ''
        let archivedIcon = ''
        let archBack = ''
        if(mood.isLiked){
            starIcon = 'stared'
            backStar = 'back'
        }
        if(mood.isArchived){
            archivedIcon = 'archivedIcon'
            archBack = 'archBack'
            backStar = 'none'
        }
        
        const timeAgo = getTimeAgo(mood.createdAt)

      moodFeed +=
      `
      <div class="moodFeed ${backStar} ${archBack}">
      <div class="flexOne">
      <i class="fa-solid fa-star ${starIcon}" data-star="${mood.uuid}"></i>
      <i class="fa-solid fa-box-archive ${archivedIcon}" data-archived=${mood.uuid}></i>
      </div>
            <p class="emoji"> 
            <span>Mood:</span> 
            ${mood.moods}</p>
            <p class="text">
            <span>Thoughts:</span>
             ${mood.textarea}
             </p>
             
             <div class="flexTwo">
                <i class="fa-solid fa-delete-left" data-delete="${mood.uuid}"></i>
             </div>
             <div>
                <p class="time-ago">${timeAgo}</p>
             </div>
             </div>
      `
    })
    return moodFeed
}

function render(){
    document.getElementById('feed').innerHTML = getMoodLoop()
}
render()
