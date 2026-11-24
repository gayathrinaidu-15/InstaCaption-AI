const description = document.getElementById("description");
const charCount = document.getElementById("charCount");
const moodGrid = document.getElementById("moodGrid");
const generateBtn = document.getElementById("generateBtn");
const results = document.getElementById("results");
const captionList = document.getElementById("captionList");
const message = document.getElementById("message");
const favouritesList = document.getElementById("favouritesList");

let selectedMood = "Funny";
let favourites = JSON.parse(localStorage.getItem("captionFavourites") || "[]");

const captionStyles = {
 Funny: [
  text => `I came, I saw, I made it everyone’s problem. ${text ? "The plot today: " + text + "." : "Main character energy, questionable decisions."} 😂`,
  text => `Proof that my life is basically a comedy show. ${text ? text + " — obviously!" : "No script, just vibes."} 🤣`,
  text => `If laughter is the best medicine, consider this my daily dose. ${text ? "Featuring: " + text + "." : "Certified chaos in progress."} 😜`
 ],
 Romantic: [
  text => `Some moments feel like a love song. ${text ? text + "." : "And I never want this feeling to end."} 💗`,
  text => `A little romance, a lot of heart, and memories I’ll keep forever. ${text ? text + "." : "You make ordinary moments magical."} 🌹`,
  text => `Falling for the little things, one beautiful moment at a time. ${text ? text + "." : "Love looks good from here."} ✨`
 ],
 Professional: [
  text => `Focused on growth, grateful for progress. ${text ? "Today’s highlight: " + text + "." : "Every step is part of the journey."} 💼`,
  text => `Building meaningful moments and turning ideas into action. ${text ? text + "." : "Progress over perfection."} 📈`,
  text => `Showing up with purpose, learning with every experience. ${text ? text + "." : "The work continues."} ✨`
 ],
 Attitude: [
  text => `Not here to fit in. Here to leave a mark. ${text ? text + "." : "My vibe speaks for itself."} 😎`,
  text => `Quiet confidence. Unmatched energy. ${text ? "Today's mood: " + text + "." : "I know my worth."} 🔥`,
  text => `I don’t chase the spotlight; I bring my own. ${text ? text + "." : "Stay real, stay rare."} 👑`
 ],
 Cute: [
  text => `A tiny moment, a happy heart, and the biggest smile. ${text ? text + "." : "Collecting little joys."} 🧸`,
  text => `Sprinkling a little sunshine wherever I go. ${text ? text + "." : "Too much cuteness for one frame."} 🌸`,
  text => `Happiness looks a lot like this. ${text ? text + "." : "Saving this sweet little memory."} 🥰`
 ],
 Inspirational: [
  text => `Small steps every day lead to beautiful places. ${text ? text + "." : "Keep believing in your journey."} 🌟`,
  text => `Be proud of how far you’ve come, and excited for where you’re going. ${text ? text + "." : "Your story is still unfolding."} 💫`,
  text => `Dream it. Work for it. Live it. ${text ? "One moment at a time: " + text + "." : "Your time is now."} 🚀`
 ]
};
const hashtagMap = {
 Funny:"#FunnyMoments #GoodVibes #JustForLaughs #InstaMood #DailyDoseOfFun",
 Romantic:"#LoveAndLight #RomanticVibes #LoveMoments #HeartFull #InstaLove",
 Professional:"#ProfessionalGrowth #CareerJourney #KeepGrowing #WorkWithPurpose #SuccessMindset",
 Attitude:"#AttitudeOnPoint #OwnYourVibe #Confidence #BeYourself #Unstoppable",
 Cute:"#CuteMoments #LittleThings #SweetVibes #HappyHeart #InstaCute",
 Inspirational:"#StayInspired #KeepGoing #DreamBig #PositiveMindset #DailyMotivation"
};

moodGrid.addEventListener("click", event => {
 const button = event.target.closest(".mood");
 if (!button) return;
 document.querySelectorAll(".mood").forEach(item => item.classList.remove("active"));
 button.classList.add("active");
 selectedMood = button.dataset.mood;
});

description.addEventListener("input", () => {
 charCount.textContent = `${description.value.length}/1000`;
});

document.getElementById("clearBtn").addEventListener("click", () => {
 description.value = "";
 charCount.textContent = "0/1000";
 message.textContent = "";
 description.focus();
});

generateBtn.addEventListener("click", () => {
 const text = description.value.trim();
 if (!text) {
  message.textContent = "Please describe your Instagram post first.";
  description.focus();
  return;
 }
 message.textContent = "";
 const captions = captionStyles[selectedMood].map(make => make(text));
 captionList.innerHTML = "";
 captions.forEach((caption, index) => {
  const card = document.createElement("article");
  card.className = "caption-card";
  const top = document.createElement("div");
  top.className = "caption-top";
  top.innerHTML = `<span class="caption-number">CAPTION 0${index + 1}</span><span class="result-count">${selectedMood.toUpperCase()}</span>`;
  const body = document.createElement("p");
  body.className = "caption-text";
  body.textContent = caption;
  const tags = document.createElement("p");
  tags.className = "hashtags";
  tags.textContent = hashtagMap[selectedMood];
  const actions = document.createElement("div");
  actions.className = "card-actions";
  const copy = document.createElement("button");
  copy.className = "small-btn";
  copy.textContent = "▢ Copy";
  copy.addEventListener("click", async () => {
   const fullText = `${caption}\n\n${hashtagMap[selectedMood]}`;
   try { await navigator.clipboard.writeText(fullText); copy.textContent = "✓ Copied"; }
   catch { copy.textContent = "Select and copy"; }
   setTimeout(() => copy.textContent = "▢ Copy", 1500);
  });
  const save = document.createElement("button");
  save.className = "small-btn";
  const alreadySaved = favourites.some(item => item.caption === caption);
  save.textContent = alreadySaved ? "♥ Saved" : "♡ Save favourite";
  if (alreadySaved) save.classList.add("saved");
  save.addEventListener("click", () => {
   if (favourites.some(item => item.caption === caption)) return;
   favourites.unshift({caption, hashtags:hashtagMap[selectedMood], mood:selectedMood});
   localStorage.setItem("captionFavourites", JSON.stringify(favourites));
   save.textContent = "♥ Saved";
   save.classList.add("saved");
   renderFavourites();
  });
  actions.append(copy, save);
  card.append(top, body, tags, actions);
  captionList.append(card);
 });
 results.classList.remove("hidden");
 results.scrollIntoView({behavior:"smooth", block:"nearest"});
});

function renderFavourites() {
 favouritesList.innerHTML = "";
 if (!favourites.length) {
  favouritesList.innerHTML = `<div class="empty-state"><span>♡</span><p>No favourite captions saved yet.</p><small>Tap “Save favourite” on any caption to keep it here.</small></div>`;
  return;
 }
 favourites.forEach((item, index) => {
  const row = document.createElement("div");
  row.className = "favourite-item";
  const content = document.createElement("div");
  const caption = document.createElement("p");
  caption.textContent = item.caption;
  const tags = document.createElement("small");
  tags.style.cssText = "display:block;color:#c75d88;font-size:10px;margin-top:5px";
  tags.textContent = item.hashtags;
  content.append(caption, tags);
  const remove = document.createElement("button");
  remove.className = "remove-btn";
  remove.type = "button";
  remove.textContent = "×";
  remove.title = "Remove favourite";
  remove.addEventListener("click", () => {
   favourites.splice(index, 1);
   localStorage.setItem("captionFavourites", JSON.stringify(favourites));
   renderFavourites();
  });
  row.append(content, remove);
  favouritesList.append(row);
 });
}
renderFavourites();
