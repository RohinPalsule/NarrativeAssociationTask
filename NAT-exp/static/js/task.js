var debug_mode = 0; // debug mode determines how long the blocks are, 5 sec in debug mode, 5 minutes in actual experiment
//var data_save_method = 'csv_server_py';
var data_save_method = 'csv_server_py';

// Will be set to true when experiment is exiting fullscreen normally, to prevent above end experiment code
var normal_exit = false;
var window_height = window.screen.height;


//this is to test if the user leave the webpage
var detectfocus=0
var isinfocus=1
document.addEventListener('mouseleave', e=>{
  detectfocus=detectfocus+1
  isinfocus=0
  //this is to see if user are focus or not
})
document.addEventListener('visibilitychange', e=>{
   if (document.visibilityState === 'visible') {
 //report that user is in focus
 isinfocus=1
  } else {
  detectfocus=detectfocus+1
  isinfocus=0
  //this is to see if user are focus or not
  }  
})

// Randomly generate an 8-character alphanumeric subject ID via jsPsych
var subject_id = jsPsych.randomization.randomID(8);

// Load PsiTurk
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
var condition = psiturk.taskdata.get('condition') + 1; // they do zero-indexing
var stimulus_chosen =[]
var timeline = []

//welcome page
var welcome = {
  type: 'survey-html-form',
  html: "<label for='worker_id'>Enter your Prolific Worker ID. Please make sure this is correct! </label><br><input type='text' id='worker_id' name='worker_id' required><br><br>",
  on_finish: function (data) {
    data.trial_type = "id_enter"
    window.useridtouse=data.responses
    window.useridtouse = useridtouse.split('"')[3];
    subject_id=useridtouse
  }
}
//welcome page end

//fullscreen start

var enterFullscreen = {
  type: 'html-button-response',
  stimulus: `
        <style>
            ul {
                list-style-type: disc;
                margin: 20px 0;
                padding-left: 100px;
                text-align: left;
            }
            li {
                margin-bottom: 15px;
                font-size: 18px;
                line-height: 1.6;
            }
            p {
                font-size: 18px;
                line-height: 1.6;
                margin: 10px 0;
                text-align: center;
            }
        </style>
        <h3 style='text-align: center'><strong>Thank you for your participation in this study. Please:</strong></h3>
        <br />
        <ul>
            <li>Follow the instructions for each task and try your best to perform well.</li>
            <li>Maximize your browser and focus completely on the task without any distractions.</li>
            <li><strong>DO NOT</strong> take notes during the experiment, as this interferes with our ability to accurately measure the learning process.</li>
            <li><strong>DO NOT</strong> participate if you feel you cannot fully commit to these requirements.</li>
        </ul> <br />
        <p>When you are ready to take the experiment, click 'Enter Fullscreen' to begin.</p> <br />
    `,
  choices: ['Enter Fullscreen'],
  on_finish: function() {
      // Trigger fullscreen mode when the button is clicked
      document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
  }
};

//fullscreen end


//Instruction page
function createinstruct(instruct_1,number){
  var intro={
    type: 'html-keyboard-response',
    choices: ['space'],
    stimulus: instruct_1,
    on_finish: function (data) {
      data.trial_type = 'intro_'+number;
      data.stimulus='instruct'
    }
  }
  return intro
}

function createfulintro(instruct,instructnames){
  intro={}
for (let i = 0; i < instructnames.length; i++) {
  instructname=instructnames[i]
  intro[i] = createinstruct(instruct[instructname],i)
}return intro
}


intro_learn=createfulintro(instruct,instructnames)
intro_dir=createfulintro(dir_instruct,dir_instructnames)

timeline.push(welcome,enterFullscreen)
timelinepushintro(intro_learn,instructnames)


//Instruction page end


// learning phase

var warning_page={
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  trial_duration:3000,
  stimulus: '<h1 style="color: red;">Please make sure to respond to the questions.</h1><br><h1 style="color: red;">Continued failure to respond will</h1><br><h1 style="color: red;">result in the task ending early</h1><br><h1 style="color: red;">The experiment will resume in 3 seconds</h1>',
  on_finish: function(data) {
    data.trial_type='warning_page'
    data.stimulus='warning'
    warning=warning+1
  }
}

function sum(arr) {
  return arr.reduce((acc, num) => acc + num, 0)
}
let remainingtimeline = []


let trial_num = 0
var length = []

TaskFailed = {
  type: 'html-keyboard-response',
  stimulus: '<p>Unfortunately, you do not qualify to continue this experiment.</p>' +
            '<p>Please press <strong>Escape</strong> to close the window. You will be paid for your time up to now.</p>',
  choices: ['Esc'],
  on_finish: function(data){
    window.close();
  }
};

for (i=0;i<num_learn_trials;i++) {
  var learn_phase = {
    type: 'html-button-response',
    choices: ["Continue"],
    stimulus:createStoryBox(story_text,trial_num),
    on_finish: function(data) {
      data.trial_type = 'story_text';
    }
  }
  timeline.push(learn_phase)
  trial_num += 1
}

  var write_phase = {
    type: 'html-button-response',
    choices: [],
    stimulus:createStoryWritingBox(),
    on_load: function() {
      document.getElementById("confirm-btn").addEventListener("click", function() {
          // Save user input
          userStory = document.getElementById("story-input").value;

          // Hide the confirm button, show the continue button
          document.getElementById("confirm-btn").style.display = "none";
          document.getElementById("continue-btn").style.display = "inline-block";
      });

      document.getElementById("continue-btn").addEventListener("click", function() {
          // Manually finish the jsPsych trial
          jsPsych.finishTrial({
              trial_type: "story_text",
              story_response: userStory
          });
      });
    },
    on_finish: function(data) {
      data.trial_type = 'story_text';
    }
  }
  timeline.push(write_phase)

timelinepushintro(intro_dir,dir_instructnames)
curr_direct_trial = 0
dataTrial = 0
for (i=0;i<img_correct.length;i++) {
  var association_phase = {
    type: 'html-keyboard-response',
    choices: ['1','2','3'],
    stimulus:create_direct_trial(img_top,img_left,img_mid,img_right,curr_direct_trial),
    on_load: function(){
      setTimeout(function() {
        for(let i = 0;i<document.getElementsByClassName('bottom').length;i++){
          document.getElementsByClassName('bottom')[i].style.visibility = 'visible';
        }
      }, 500);
    },
    on_finish: function(data){
      data.trial_type = 'Association'
      data.stimulus=img_top[dataTrial];
      data.stimulus_down_left=img_left[dataTrial],
      data.stimulus_down_mid=img_mid[dataTrial]
      data.stimulus_down_right=img_right[dataTrial];
      data.stimulus_correct=img_correct[dataTrial];
      data.stimulus_short=img_wrong_samestory[dataTrial];
      data.stimulus_far=img_wrong_diffstory[dataTrial];
      if (data.key_press == 49){
        stimulus_chosen.push(data.stimulus_down_left)
      } else if (data.key_press == 50){
        stimulus_chosen.push(data.stimulus_down_mid)
      } else if (data.key_press == 51){
        stimulus_chosen.push(data.stimulus_down_right)
      }
      if ((data.key_press == 49 && data.stimulus_down_left == data.stimulus_correct)||
      (data.key_press == 50 && data.stimulus_down_mid == data.stimulus_correct) ||(data.key_press == 51 && data.stimulus_down_right == data.stimulus_correct)) {
        console.log(data.key_press)
        console.log(img_left[dataTrial])
        console.log(data.stimulus_correct)
        data.accuracy = 1
        directcorrectness.push(1)
        data.weighted_accuracy = 1
      } else {
        data.accuracy = 0
        directcorrectness.push(0)
        data.weighted_accuracy = 0
      }
      console.log(data.key_press)
      console.log(img_left[dataTrial])
      console.log(data.stimulus_correct)
      if ((data.key_press == 49 && data.stimulus_down_left == data.stimulus_short)||
      (data.key_press == 50 && data.stimulus_down_mid == data.stimulus_short) ||(data.key_press == 51 && data.stimulus_down_right == data.stimulus_short)) {
        data.missedtrial = 'closer'
        data.weighted_accuracy = 0.5
      } else if ((data.key_press == 49 && data.stimulus_down_left == data.stimulus_far)||
      (data.key_press == 50 && data.stimulus_down_mid == data.stimulus_far) ||(data.key_press == 51 && data.stimulus_down_right == data.stimulus_far)) {
        data.missedtrial = 'closer'
        data.weighted_accuracy = 0.5
      }
      dataTrial +=1
      let directsum = 0;
      directcorrectness.forEach(function(value) {
        directsum += value;
      });

      data.cumulative_accuracy = directsum / directcorrectness.length;
      accuracy = data.cumulative_accuracy 
      
    }
  }
  curr_direct_trial += 1
  timeline.push(association_phase)
}
console.log(accuracy)
var directcorrectness = []
var accuracy = []
let recog_trial_num = 0
let on_finish_num = 0
let correctResp = []

let wrongbreak= {
  type: 'html-keyboard-response',
  choices:jsPsych.NO_KEYS,
  trial_duration: 400,
  stimulus:create_memory_ten()
}

// for (i=0;i<num_recognition_trials;i++){
//   var second_learn_phase = {
//     type: 'html-keyboard-responsefl',
//     choices: jsPsych.NO_KEYS,
//     response_ends_trial: false,
//     stimulus:create_image_learn(recognition_list,recog_trial_num),
//     stimulus_duration:3000,
//     trial_duration:3000,
//     on_finish: function(data) {
//       data.trial_type = 'second_learn_phase';
//       data.stimulus= recognition_list[recog_trial_num]
//       data.image_type = shuffled_img_type[recog_trial_num]
//       data.new_old = new_old[recog_trial_num]
//       sfa=1
//     }
//   }
//   timeline.push(second_learn_phase)
//   var familiarity = {
//     type: 'html-keyboard-response',
//     choices: ['1','2','3','4','5'],
//     stimulus: `
//       <div id="familiar" style="max-width: 1200px; margin: 100px auto; text-align: center;">
//         <img style='width: 250px;height: 250px;margin-bottom:100px' src='../static/images/${recognition_list[recog_trial_num]}' height='250'></style>
//         <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
//           How familiar is the image on a scale of 1 to 5?
//         </p>
//         <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
//           <br>
//           <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 28px; margin-top: 20px;">
//             <p>(1) Not at all familiar</p>
//             <p>(2) Slightly familiar</p>
//             <p>(3) Moderately familiar</p>
//             <p>(4) Very familiar</p>
//             <p>(5) Extremely familiar</p>
//           </div><br><br>
//         <strong>Press the number key that corresponds with your rating.</strong>
//         </p>
//       </div>
//     `,
//     response_ends_trial: true,
//     on_finish: function(data) {
//       data.stimulus= recognition_list[recog_trial_num]
//       data.trial_type = 'familiar_rating';
//       data.rating = data.key_press - 48
//     } 
//   }
//   timeline.push(familiarity);
//   var uniqueness = {
//     type: 'html-keyboard-response',
//     choices: ['1','2','3','4','5'],
//     stimulus: `

//       <div id="unique" style="max-width: 1200px; margin: 100px auto; text-align: center">  
//         <img style='width: 250px;height: 250px;margin-bottom:100px' src='../static/images/${recognition_list[recog_trial_num]}' height='250'></style>
//         <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
//           How unique is the image on a scale of 1 to 5?
//         </p>
//         <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
//           <br>
//           <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 28px; margin-top: 20px;">
//             <p>(1) Not at all unique</p>
//             <p>(2) Slightly unique</p>
//             <p>(3) Moderately unique</p>
//             <p>(4) Very unique</p>
//             <p>(5) Extremely unique</p>
//           </div><br><br>
//         <strong>Press the number key that corresponds with your rating.</strong>
//         </p>
//       </div>
//     `,
//     response_ends_trial: true,
//     on_finish: function(data) {
//       data.stimulus= recognition_list[recog_trial_num]
//       data.trial_type = 'pt2_unique_rating';
//       data.rating = data.key_press - 48
//     } 
//   }
//   timeline.push(uniqueness);
//   var memorability = {
//     type: 'html-keyboard-response',
//     choices: ['1','2','3','4','5'],
//     stimulus: `
//       <div id="memorable" style="max-width: 1200px; margin: 100px auto; text-align: center;">
//         <img style='width: 250px;height: 250px;margin-bottom:100px' src='../static/images/${recognition_list[recog_trial_num]}' height='250'></style>
//         <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
//           How memorable is the image on a scale of 1 to 5?
//         </p>
//         <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
//           <br>
//           <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 28px; margin-top: 20px;">
//             <p>(1) Not at all memorable</p>
//             <p>(2) Slightly memorable</p>
//             <p>(3) Moderately memorable</p>
//             <p>(4) Very memorable</p>
//             <p>(5) Extremely memorable</p>
//           </div><br><br>
//         <strong>Press the number key that corresponds with your rating.</strong>
//         </p>
//       </div>
//     `,
//     response_ends_trial: true,
//     on_finish: function(data) {
//       data.stimulus= recognition_list[recog_trial_num]
//       data.trial_type = 'memorable_rating';
//       data.rating = data.key_press - 48
//     } 
//   }
//   timeline.push(memorability);
//   var img_recognition = {
//     type: 'html-keyboard-response',
//     choices: ['1','2'],
//     response_ends_trial: true,
//     stimulus:create_image_recognition(recognition_list,recog_trial_num),
//     stimulus_duration:10000,
//     trial_duration:10000,
//     on_finish: function(data) {
//       data.trial_type = 'recognition_phase';
//       data.stimulus= recognition_list[recog_trial_num]
//       if (data.key_press == 49){
//         data.response = "old"
//       } else if (data.key_press == 50){
//         data.response = "new"
//       } else {
//         data.response = "MISSED"
//       }
//       if(data.key_press == 49 && new_old[on_finish_num] == "OLD" || data.key_press == 50 && new_old[on_finish_num] == "NEW"){
//         data.correct = 1
//         correctResp.push(1)
//         data.accuracy = sum(correctResp) / correctResp.length
//       } else if (data.key_press == 49 && new_old[on_finish_num] == "NEW" || data.key_press == 50 && new_old[on_finish_num] == "OLD"){
//         data.correct = 0 
//         correctResp.push(0)
//         data.accuracy = sum(correctResp) / correctResp.length
//       } else {
//         data.correct = NaN
//         correctResp.push(0)
//         data.accuracy = sum(correctResp) / correctResp.length
//       }
//       on_finish_num += 1
//     }
//   }
//   recog_trial_num += 1
//   timeline.push(img_recognition)
//   var recog_confidence = {
//     type: 'html-keyboard-response',
//     choices: ['1','2','3','4'],
//     response_ends_trial: true,
//     stimulus:`
//       <div id="confidence" style="max-width: 1000px; margin: 100px auto; text-align: center;">
//         <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
//           How confident are you in your response?
//         </p>
//         <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
//           <br>
//           <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 30px; margin-top: 20px;">
//             <p>(1) Not at all confident</p>
//             <p>(2) Slightly confident</p>
//             <p>(3) Moderately confident</p>
//             <p>(4) Very confident</p>
//           </div><br><br>
//         <strong>Press the number key that corresponds with your rating.</strong>
//         </p>
//       </div>
//     `,
//     stimulus_duration:10000,//5 second for now, we will discuss it 
//     trial_duration:10000,//5 second for now 
//     on_finish: function (data){
//       data.trial_type = 'confidence';
//       data.stimulus= recognition_list[recog_trial_num]
//       data.confidence = data.key_press - 48
//     }
//   }
//   timeline.push(recog_confidence);
// }


// final thank you
var thank_you = {
  type: 'html-keyboard-response',
  choices: ['space'],
  stimulus: "<p> Congratulations, you are all done!</p><p>The secret code to enter at the beginning screen is: AJFHBG897</p><p> Please make sure to submit the HIT and email uciccnl@gmail.com if you had any issues! </p>",
  on_load: function() {
    dictionary = {
      "ID":subject_id,
      "Story_Reconstruction": userStory,
      "ImgListTop": img_top,
      "ImgListLeft": img_left,
      "ImgListMid": img_mid,
      "ImgListRight": img_right,
      "ImgListCorrect": img_correct,
      "ImgListSelected": stimulus_chosen,
      "Correct": directcorrectness,
      "Accuracy": accuracy
    }
    downloadCSVFromObject(`${subject_id}.csv`, dictionary);
  },
  on_finish: function (data) {
    data.trial_type = 'thank_you';
    data.detectfocus = detectfocus;
    save_data(true)
  }
}
var dictionary = {}
timeline.push(thank_you);

//time line here


function downloadCSVFromObject(filename, dataObj) {
  // Extract column names (keys of the object)
  let columnNames = Object.keys(dataObj);
  
  // Determine the number of rows from the longest array (if arrays exist)
  let numRows = Math.max(...Object.values(dataObj).map(val => Array.isArray(val) ? val.length : 1));

  // Create CSV content
  let csvContent = columnNames.join(",") + "\n"; // Column headers

  // Construct rows
  for (let i = 0; i < numRows; i++) {
      let rowData = columnNames.map(col => {
          let value = dataObj[col];
          if (Array.isArray(value)) {
              return value[i] ?? ""; // Take the i-th value if it's an array
          } else {
              return i === 0 ? value : ""; // Only put single values in the first row
          }
      });
      csvContent += rowData.join(",") + "\n";
  }

  // Create Blob and trigger download
  let blob = new Blob([csvContent], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  
  let a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


jsPsych.init({
  timeline: timeline,
  preload_images: all_images,
  max_load_time: 600000,
  on_finish: function () {
    psiturk.recordUnstructuredData("subject_id", subject_id);
    save_data(true)
  },
})
