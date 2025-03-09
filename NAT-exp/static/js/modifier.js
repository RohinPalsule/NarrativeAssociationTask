//debug moode on/off
debugmode= true
if (debugmode==true){
  num_learn_trials = 2
  num_recognition_trials = 5
  num_write_trials = 1
}else{
  num_learn_trials = 25
  num_recognition_trials = 50
}
n_learning_trial=3 //This determine the number of learning trial you want in total
n_direct_trial=10 //how many direct trial you want
n_shortest_trial=10 //how many shortest path you want
n_goaldir_trial=10 //how many goal directed planning you want
//warningpage
warning=0 //this is to start the counter of total warning
warning_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5;color:red'>Warning, you are missing too many trials, make sure to press the key '1' when you see a blue cross flash and '2' when you see a green one. If you keep missing trials you will be disqualified.</p>",
checkfail=0 //this is to start the attentioncheck
checkthreshold=2 //this is to add the threshold for attentioncheck

//Text for instruction
instruct_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 55px;margin-bottom:40px'><b>Welcome!</b></p><p style ='font-size: 40px;line-height:1.5'>In this experiment, you will be presented with a series of stories. Your goal is to read these stories and try to remember them in as much detail as you can.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
//instruct_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>After the story is presented, you will be asked to recall the story as it was presented to you with as much detail as possible. You will see a button on your screen to record your audio responses, so please be sure to speak as clear as you can.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>After the story is presented, you will be asked to recall the story by typing what you read as it was presented to you with as much detail as possible.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_3="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>These stories will be presented to you one at a time. When you have read the story, please press the continue button on your screen.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to start the experiment]</p>",

instructnames = ["instruct_1","instruct_2","instruct_3"]// IF you want to add or decrease number of page for instruct, just delete or add var name here.
let instruct={instruct_1,instruct_2,instruct_3} // IF you want to add or decrease number of page for instruct, just delete or add var here.


//Text for direct memory instruction

// COULD ADD A CHOICE WHERE THEY PICK WHICH STORY IT IS FROM
instruct_dir_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>For this next portion, you will once again be tested on your memory of these stories, but this time on specific objects present in each of them.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>These narratives all included specific objects that were related to each other in some way. In this phase, you will see an image of one of those objects and are tasked with choosing an image out of the options given that is the most connected to the top one. This means you may see objects from the same story, different stories, or completely new items.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_3 = "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>A reminder that the goal is not just to remember which items went together in the same story, as you might see multiple options from the same story. Instead, you want to select which object is the most closely related to the top image, or in other words reqires the fewest associations to relate the two in the context of the story.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_4 = "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>There will be 3 possible images to choose from. If it is the image on the left, press '1' on your keyboard. If it is the middle one, press '2'. If it is the right image, press '3'. You will have as much time as you need to respond but please still respond as quickly and as accurately as possible.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
// instruct_dir_4 = "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 40px;line-height:1.5'>You will only have a couple of seconds to respond to every trial, so try to respond as quickly and as accurately as possible.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to start]</p>",
dir_instructnames = ["instruct_dir_1","instruct_dir_2","instruct_dir_3","instruct_dir_4"] //Same for above, if you want to delete or add, just decrease or add the var
dir_instruct={instruct_dir_1,instruct_dir_2,instruct_dir_3,instruct_dir_4} //same for above

//learning phase


movie_imgs = []
for (i=1;i<11;i++){
  if (i<10){
    movie_imgs.push(`nat-0${i}.png`)
  }else {
    movie_imgs.push(`nat-${i}.png`) 
  }}

ordered_img = [[movie_imgs[0],movie_imgs[1]],[movie_imgs[1],movie_imgs[2]],[movie_imgs[2],movie_imgs[3]],[movie_imgs[3],movie_imgs[4]]]
ordered_img2 = [[movie_imgs[5],movie_imgs[6]],[movie_imgs[6],movie_imgs[7]],[movie_imgs[7],movie_imgs[8]],[movie_imgs[8],movie_imgs[9]]]


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let arr = []

for (i=0;i<ordered_img.length;i++){
  arr.push(i)
}
shuffle(arr)

let img_top = []
let img_correct = []
let img_wrong_samestory = []
let img_wrong_diffstory = []
for (i=0;i<arr.length;i++){
  img_top.push(ordered_img[arr[i]][0])
  img_correct.push(ordered_img[arr[i]][1])
  var num = Math.floor(Math.random()*5)
  wrong = movie_imgs[num]
  while (wrong == img_correct[i] || wrong == img_top[i]){
    num = Math.floor(Math.random()*5)
    wrong = movie_imgs[num]
  }
  img_wrong_samestory.push(wrong)
  img_wrong_diffstory.push(ordered_img2[arr[i]][0])
}

for (i=0;i<arr.length;i++){
  img_top.push(ordered_img2[arr[i]][0])
  img_correct.push(ordered_img2[arr[i]][1])
  var num = Math.floor(Math.random()*5) + 5
  wrong = movie_imgs[num]
  while (wrong == img_correct[i+4] || wrong == img_top[i+4]){
    num = Math.floor(Math.random()*5) + 5
    wrong = movie_imgs[num]
  }
  img_wrong_samestory.push(wrong)
  img_wrong_diffstory.push(ordered_img[arr[i]][0])
}

var img_left = []
var img_mid = []
var img_right = []



for (i=0;i<img_correct.length;i++){
  var random_num = Math.floor(Math.random()*3)
  if (random_num ==0){
    img_left.push(img_correct[i])
    img_mid.push(img_wrong_diffstory[i])
    img_right.push(img_wrong_samestory[i])
  } else if (random_num ==1){
    img_left.push(img_wrong_diffstory[i])
    img_mid.push(img_correct[i])
    img_right.push(img_wrong_samestory[i])
  } else if (random_num ==2){
    img_left.push(img_wrong_samestory[i])
    img_mid.push(img_wrong_diffstory[i])
    img_right.push(img_correct[i])
  }
}


let story_text = [`
  Elias found the broken pocket watch buried in the sand just outside the abandoned library. It was stuck at 3:47, the exact time his grandfather had vanished decades ago. He ran his thumb over the cracked glass, wondering if this was a coincidence—or a message.
  <br><br>Inside the library, dust coated the shelves, but the checkout desk held a single, faded library card. The name had been smudged beyond recognition, but the last book borrowed stood out: The Vanishing Hour. Elias pulled it from the shelf and flipped through the pages. A red feather slipped out, landing on the floor. The tip was burned. He shivered. His grandfather had once told him a story about birds that carried fire in their wings.
  <br><br>As he placed the feather back in the book, something rattled inside its spine. He carefully pried it open and found a brass key with no teeth. A key that opened nothing. Or maybe… something that didn’t need a lock.
  <br><br>His hand instinctively went to his pocket, where he kept a peculiar glass marble filled with swirling silver mist. It had been his grandfather’s, a keepsake he never understood. But now, holding the key in one hand and the marble in the other, he heard it—whispers, faint and distant.
  <br><br>He closed his eyes, listening. The words became clearer:
  <br><br>“Come find me. Before time runs out.”
  <br><br>The watch ticked once. Then stopped.
  <br><br>Elias exhaled. The hunt was on.`,
  `
  The train station was empty when Mara arrived, save for a single torn ticket caught beneath a bench. She picked it up. Only the date was visible—today’s. The destination had been ripped away.
  <br><br>Something rattled in her bag. She hesitated before pulling out the locked wooden box. It had belonged to her mother, passed down from a grandmother she had never met. She’d never found the key, but tonight, it felt heavier, as if waiting for something.
  <br><br>A whisper of wind made her turn. On the station wall, taped to the glass, was a child’s drawing of a house. The shape was familiar—her grandmother’s old home—but the windows were shaded black, as if hiding something inside.
  <br><br>Mara’s grip tightened around the box. Her mother had warned her never to visit that house at night. Never to enter. But she had never said why.
  <br><br>A flicker caught her eye—a rusted lantern with no wick, left abandoned near the tracks. She picked it up, and through the green-tinted glass, she saw something glint inside the base. She pried it open and fished out a silver spoon, its handle engraved: J.L.
  <br><br>Her grandmother’s initials.
  <br><br>The train whistle blew in the distance. She looked at the torn ticket. Then at the lantern. Then at the box.
  <br><br>She had a choice to make.
  <br><br>And she knew, deep down, that whatever she chose… the house was waiting.`]
