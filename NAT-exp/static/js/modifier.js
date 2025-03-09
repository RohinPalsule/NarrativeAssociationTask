//debug moode on/off
debugmode= true
if (debugmode==true){
  num_learn_trials = 2
  num_recognition_trials = 5
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
warning_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5;color:red'>Warning, you are missing too many trials, make sure to press the key '1' when you see a blue cross flash and '2' when you see a green one. If you keep missing trials you will be disqualified.</p>",
checkfail=0 //this is to start the attentioncheck
checkthreshold=2 //this is to add the threshold for attentioncheck

//Text for instruction
instruct_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 55px;margin-bottom:40px'><b>Welcome!</b></p><p style ='font-size: 50px;line-height:1.5'>In this experiment, you will be presented with a series of stories. Your goal is to read these stories and try to remember them in as much detail as you can.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
//instruct_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>After the story is presented, you will be asked to recall the story as it was presented to you with as much detail as possible. You will see a button on your screen to record your audio responses, so please be sure to speak as clear as you can.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>After the story is presented, you will be asked to recall the story by typing what you read as it was presented to you with as much detail as possible.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_3="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>These stories will be presented to you one at a time. When you have read the story, please press the continue button on your screen.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to start the experiment]</p>",

instructnames = ["instruct_1","instruct_2","instruct_3"]// IF you want to add or decrease number of page for instruct, just delete or add var name here.
let instruct={instruct_1,instruct_2,instruct_3} // IF you want to add or decrease number of page for instruct, just delete or add var here.


//Text for direct memory instruction
instruct_dir_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>For this next portion, you will continue to make image ratings, but we will also test you on your memory for what you saw before.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>On each trial, you will be presented with an image. In addition to providing ratings as you’ve done before, you will be asked to indicate if this is an image you’ve seen before in the previous phase, or a new image you are seeing for the first time.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_3 = "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>If the image is <strong>OLD</strong> (what you have seen before) press '1'. If it is <strong>NEW</strong> press '2'. If you are unsure, make your best guess. You will also be asked about how confident you are in your response.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
// instruct_dir_4 = "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>You will only have a couple of seconds to respond to every trial, so try to respond as quickly and as accurately as possible.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to start]</p>",
dir_instructnames = ["instruct_dir_1","instruct_dir_2","instruct_dir_3"] //Same for above, if you want to delete or add, just decrease or add the var
dir_instruct={instruct_dir_1,instruct_dir_2,instruct_dir_3} //same for above

//learning phase

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let img_mm_list = []
let unshuffled_img_type = []

for (i=1;i<31;i++){
  if (i<10){
    img_mm_list.push(`img_manmade_0${i}.png`)
    unshuffled_img_type.push("MM")
  } else {
    img_mm_list.push(`img_manmade_${i}.png`)
    unshuffled_img_type.push("MM")
  }
}
let img_nat_list = []

for (i=1;i<31;i++){
  if (i<10){
    img_nat_list.push(`img_natural_0${i}.png`)
    unshuffled_img_type.push("NAT")
  } else {
    img_nat_list.push(`img_natural_${i}.png`)
    unshuffled_img_type.push("NAT")
  }
}

let nat_arr = []
let mm_arr = []

for (let i = 0; i < img_mm_list.length;i++){
  mm_arr.push(i)
  nat_arr.push(i)
}

shuffle(mm_arr);
shuffle(nat_arr);

let mm_list_shuff = []
let nat_list_shuff = []
let unshuffled_img_type_learn = []

for (let i = 0; i < img_mm_list.length;i++){
  mm_list_shuff.push(img_mm_list[mm_arr[i]])
  nat_list_shuff.push(img_nat_list[nat_arr[i]])
}

first_phase_unshuffled = mm_list_shuff.slice(0,15).concat(nat_list_shuff.slice(0,15))
unshuffled_img_type_learn = unshuffled_img_type.slice(0,15).concat(unshuffled_img_type.slice(30,45))

new_img_unshuffled = mm_list_shuff.slice(15).concat(nat_list_shuff.slice(15))
unshuffled_img_type = unshuffled_img_type_learn.concat(unshuffled_img_type.slice(15,30),unshuffled_img_type.slice(45,60))


var recognition_unshuffled = first_phase_unshuffled.concat(new_img_unshuffled);
let slice_recognition_list = []
let recognition_list = [];
let recog_arr = [];

let new_old_unshuff = []
let new_old = []
let shuffled_img_type = []




for (let i = 0; i < recognition_unshuffled.length; i++) {
  recog_arr.push(i);
  if (i < 30){
    new_old_unshuff.push("OLD")
  }else {
    new_old_unshuff.push("NEW")
  }
}
shuffle(recog_arr)
for (let i = 0; i < recognition_unshuffled.length;i++){
  recognition_list.push(recognition_unshuffled[recog_arr[i]])
  new_old.push(new_old_unshuff[recog_arr[i]])
  shuffled_img_type.push(unshuffled_img_type[recog_arr[i]])
}

let learn_unshuffled = first_phase_unshuffled
let foil_unshuffled = new_img_unshuffled

let shuffled_learn_img_type = []
let learn_img = [];
let learn_arr = [];
for (let i = 0; i < learn_unshuffled.length; i++) {
  learn_arr.push(i);
}
shuffle(learn_arr)
for (let i = 0; i < learn_unshuffled.length;i++){
  learn_img.push(learn_unshuffled[learn_arr[i]])
  shuffled_learn_img_type.push(unshuffled_img_type_learn[learn_arr[i]])
}

let foil_img = [];
let foil_arr = [];
for (let i = 0; i < foil_unshuffled.length; i++) {
  foil_arr.push(i);
}
shuffle(foil_arr)
for (let i = 0; i < foil_unshuffled.length;i++){
  foil_img.push(foil_unshuffled[foil_arr[i]])
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


