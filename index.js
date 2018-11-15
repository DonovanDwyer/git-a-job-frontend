document.addEventListener('DOMContentLoaded', init);

const navbar = document.querySelector(".navbar");
const loginCont = document.querySelector(".login-container");
const searchCont = document.querySelector(".search-container");
const jobListCont = document.querySelector(".job-listing-container");
const profileCont = document.querySelector(".user-profile-container");
const jobDetailCont = document.querySelector(".job-detail-container");
let user=""
function init(){
  navbar.innerHTML = "";
  searchCont.innerHTML = "";
  jobListCont.innerHTML = "";
  profileCont.innerHTML = "";
  jobDetailCont.innerHTML = "";
  createLogo();
  createLoginSignUp();
  handleJobListClicks();
  handleSaveButtonClicks();
  handleUserJobListClicks();
  handleRemoveButtonClicks();
}

function createSearchButton(){
  let search = document.createElement('div');
  search.className = "search-toggle opened";
  search.innerHTML = "Search";
  search.addEventListener('click', function(){
    if (!event.target.className.includes("opened")){
      event.target.className += " opened";
      profileCont.innerHTML = "";
      jobListCont.innerHTML = "";
      createSearchForm();
    }
  })
  navbar.appendChild(search);
}

function createProfileButton(){
  let profileButton = document.createElement('div');
  profileButton.className = "profile-button";
  profileButton.innerText = "Profile";
  navbar.appendChild(profileButton);
  profileButton.addEventListener('click', function(e){
    let searchButton = document.querySelector('.search-toggle');
    searchButton.className = "search-toggle";
    searchCont.innerHTML = "";
    jobListCont.innerHTML = "";
    profileCont.innerHTML = "";
    jobDetailCont.innerHTML = "";
    showProfile();
  })
}

function createLogo(){
  let logo = document.createElement('h1');
  logo.className = "logo-text";
  logo.innerText = "Git a Job";
  navbar.appendChild(logo);
}

function createLoginSignUp(){
  let loginBtn = document.createElement('button');
  let signBtn = document.createElement('button');
  loginBtn.id = "log-in";
  signBtn.id = "sign-in";
  loginBtn.innerText = "Log In";
  signBtn.innerText = "Sign Up";
  loginCont.appendChild(loginBtn);
  loginCont.appendChild(signBtn);
  loginCont.addEventListener('click', function(e){
    if(event.target.id == 'log-in'){
      loginCont.innerHTML = '';
      createLoginForm();
    }
    if(event.target.id == 'sign-in'){
      loginCont.innerHTML = '';
      createSignUpForm();
    }
  })
}

function createLoginForm(){
  let loginForm = document.createElement('form');
  loginForm.className = "login-form";
  let usernameField = document.createElement('input');
  usernameField.placeholder = "Enter User Name Here";
  usernameField.className = "user-name-input";
  let submitButton = document.createElement('button');
  submitButton.type = "submit";
  submitButton.innerText = "Log In";
  loginForm.appendChild(usernameField);
  loginForm.appendChild(submitButton);
  loginCont.appendChild(loginForm);
  handleLogin(loginForm);
}

function handleLogin(loginForm){
  loginForm.addEventListener('submit', function(){
    event.preventDefault();
    let user = document.querySelector(".user-name-input").value
    pullUserFromDB(user);
})
}

function pullUserFromDB(user){
  fetch(`http://localhost:3000/users/${user}`)
    .then(res => res.json())
    .then(json => {if(json.status == 500){
      let error = document.createElement('div');
      error.className = "error-message";
      error.innerText = "No user by that name exists!"
      loginCont.prepend(error);
    } else {
      loginCont.innerHTML = '';
      createSearchForm();
      greetUser(json.user)}})
}

function createSignUpForm(){
  let signUpForm = document.createElement('form');
  signUpForm.className = "sign-up-form";
  let usernameField = document.createElement('input');
  usernameField.placeholder = "Enter User Name Here";
  usernameField.className = "user-name-input"
  let fullNameField = document.createElement('input');
  fullNameField.placeholder = "Enter Full Name Here";
  fullNameField.className = "full-name-input"
  let addressField = document.createElement('input');
  addressField.placeholder = "Enter Address Here";
  addressField.className = "address-input"
  let phoneField = document.createElement('input');
  phoneField.placeholder = "Enter Phone Number Here";
  phoneField.className = "phone-input"
  let emailField = document.createElement('input');
  emailField.placeholder = "Enter Email Address Here";
  emailField.className = "email-input"
  let submitButton = document.createElement('button');
  submitButton.type = "submit";
  submitButton.innerText = "Sign Up";
  signUpForm.appendChild(fullNameField);
  signUpForm.appendChild(usernameField);
  signUpForm.appendChild(addressField);
  signUpForm.appendChild(phoneField);
  signUpForm.appendChild(emailField);
  signUpForm.appendChild(submitButton);
  loginCont.appendChild(signUpForm);
  handleSignUp(signUpForm);
}

function handleSignUp(signUpForm){
  signUpForm.addEventListener('submit', function(){
    event.preventDefault();
    let name = document.querySelector(".full-name-input").value;
    let user = document.querySelector(".user-name-input").value;
    let address = document.querySelector(".address-input").value;
    let phone = document.querySelector(".phone-input").value;
    let email = document.querySelector(".email-input").value;
    if(name == "" || user == "" || address == "" || phone == "" || email == ""){
      let error = document.createElement('div');
      error.className = "error-message";
      error.innerText = "Please fill out sign up form completely!";
      loginCont.prepend(error);
    } else {
    addUserToDB(name, user, address, phone, email);
  }
  })
}

function addUserToDB(name, user, address, phone, email){
  return fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify({
      "name": name,
      "username": user,
      "address": address,
      "phone": phone,
      "email": email
    })
  }).then(res => res.json())
  .then(json => {
    loginCont.innerHTML = '';
    createSearchForm();
    greetUser(json);
  })
}

function greetUser(user){
  let userGreet = document.createElement('div');
  userGreet.className = "user-greet";
  userGreet.innerHTML = `Salutations, ${user.name}`;
  userGreet.dataset.id = user.id;
  navbar.appendChild(userGreet);
  createSearchButton();
  createProfileButton();
  createLogoutButton();
}

function showProfile(userId){
  searchCont.innerHTML = '';
  jobListCont.innerHTML = '';
  let currentUserId = document.querySelector('.user-greet').dataset.id
  let user = getUserInfo(currentUserId);
}

function getUserInfo(userId){
  return fetch(`http:/localhost:3000/users/find/${userId}`)
    .then(res => res.json())
    .then(json => renderUserProfile(json))
}

function renderUserProfile(user){
  profileCont.innerHTML=""
  let userProfile = document.createElement('div');
  userProfile.className = "user-profile-container";
  userProfile.innerHTML = `<h2>${user.user.name}</h2>
  <small>Username: ${user.user.username}</small>
  <p>Email Address: ${user.user.email}</p>
  <p>Home Address: ${user.user.address}</p>
  <p>Phone Number: ${user.user.phone}</p>`
  profileCont.appendChild(userProfile)
  jobListCont.innerHTML=""
  renderUserJobList(user.jobs);
  store.user_jobs.push(user.jobs);
  createEditButton(user.user)
}

function createEditButton(user){
  let editBtn= document.createElement('button')
  editBtn.className="edit-button"
  editBtn.innerText="Edit Profile"
  editBtn.addEventListener('click',function(e){
    e.preventDefault()
    editUserForm(user)
  })
  profileCont.appendChild(editBtn)
}

function editUserForm(user){

  profileCont.innerHTML=""
  let editForm=document.createElement('form')
  let nameinput=document.createElement('input')
  nameinput.className="name-edit"
  nameinput.value=`${user.name}`
  let usernameinput=document.createElement('input')
  usernameinput.className="username-edit"
  usernameinput.value=`${user.username}`
  let emailinput=document.createElement('input')
  emailinput.className="email-edit"
  emailinput.value=`${user.email}`
  let addressinput=document.createElement('input')
  addressinput.className="address-edit"
  addressinput.value=`${user.address}`
  let phoneinput=document.createElement('input')
  phoneinput.className="phone-edit"
  phoneinput.value=`${user.phone}`
  let submitBtn=document.createElement('button')
  submitBtn.type="submit"
  submitBtn.className='submit button'
  submitBtn.innerText="Submit"
  editForm.appendChild(nameinput)
    editForm.appendChild(usernameinput)
  editForm.appendChild(emailinput)
  editForm.appendChild(addressinput)
  editForm.appendChild(phoneinput)
  editForm.appendChild(submitBtn)
  editForm.addEventListener('submit',function(){


event.preventDefault()

    fetch(`http://localhost:3000/users/${user.id}`,{
      method:"PATCH",
      body: JSON.stringify({
        username:usernameinput.value,
        name:nameinput.value,
        email:emailinput.value,
        address:addressinput.value,
        phone:phoneinput.value

      }),
      headers: {
        "content-type": "application/json",
        "accepts": "application/json"
      }
    }).then(res=>res.json())
    .then(json => {
      getUserInfo(user.id)
    })
  })
profileCont.appendChild(editForm)
}

function deb(json){

  let useremb={}
  useremb.user=json

  return useremb
}

function renderUserJobList(jobs){
  iterateThroughUserJobs(jobs);
}

function createSearchForm(){
  let searchForm = document.createElement('form');
  searchForm.className = "search-form";
  let locField = document.createElement('input');
  locField.className = "location-field";
  let dropDown = document.createElement('select');
  dropDown.className = "drop-down-field"
  let fullTime = new Option('Full-Time', 'full_time', true, false);
  let partTime = new Option('Part-Time', 'part_time', false, false);
  dropDown.appendChild(fullTime);
  dropDown.appendChild(partTime);
  let desc = document.createElement('input');
  desc.className = "description-field"
  let searchBtn = document.createElement('button');
  locField.placeholder = "Enter your Location"
  desc.placeholder = "Enter Job Description"
  searchBtn.innerText = "Search"
  searchBtn.type = 'Submit';
  searchForm.appendChild(locField);
  searchForm.appendChild(dropDown);
  searchForm.appendChild(desc);
  searchForm.appendChild(searchBtn);
  searchCont.appendChild(searchForm);
  handleSearchButton(searchForm);
}

function handleSearchButton(searchForm){
  searchForm.addEventListener('submit', function(e){
    e.preventDefault();
    jobListCont.innerHTML = "";
    let location = document.querySelector(".location-field").value;
    let type = document.querySelector(".drop-down-field").value;
    type == "full_time" ? type = "full_time=true" : type = "part_time=true";
    let description = document.querySelector(".description-field").value;
    getJobs(location, type, description);
  })
}

function getJobs(location, type, description){
  location === "" ? location = "empty" : location = location
  description === "" ? description = "empty" : description = description
  fetch(`http://localhost:3000/search/${location}/${description}/${type}`)
    .then(res => res.json())
    .then(json => {if(json.length == 0){
      let error = document.createElement('div');
      error.className = "error-message";
      error.innerText = "No job matches found.";
      jobListCont.appendChild(error);
    } else {
      store.jobs = [];
      createJobObjs(json);
      iterateThroughJobs()}})
}

function createJobObjs(jobs){
  jobs.forEach(job => new Job(job.title, job.location, job.type, job.description,
    job.how_to_apply, job.company, job.company_url, job.company_logo, job.id))
}

function renderJob(job){
  let jobCont = document.createElement('div');
  jobCont.className = "job-div";
  jobCont.dataset.id = job.id;
  jobCont.innerHTML = `<h3>${job.title}</h3>
  <small>${job.company}</small> -
  <small>${job.location}</small>`
  jobListCont.appendChild(jobCont);
}

function iterateThroughJobs(){
  for(job of store.jobs){
    renderJob(job)
  }
}

function iterateThroughUserJobs(jobs){
  for(job of jobs){
    renderUserJob(job)
  }
}

function renderUserJob(job){
  let jobCont = document.createElement('div');
  jobCont.className = "user-job-div";
  jobCont.dataset.id = job.apiID;
  jobCont.innerHTML = `<h3>${job.title}</h3>
  <small>${job.company}</small> -
  <small>${job.location}</small>`
  jobListCont.appendChild(jobCont);
}

function handleJobListClicks(){
  jobListCont.addEventListener('click', function(e){
    if(e.target.className == 'job-div'){
      let jobId = event.target.dataset.id;
      let job = store.jobs.find(job => job.id == jobId);
      let userId = document.querySelector(".user-greet").dataset.id
      checkIfJobExists(job, userId).then(json => {addSaveButton(job, json)})
      renderJobDetails(job);
    }
  })
}

function handleUserJobListClicks(){
  jobListCont.addEventListener('click', function(e){
    if(e.target.className == 'user-job-div'){
      let jobId = event.target.dataset.id;
      let selectJob = store.user_jobs[0].find(job => job.apiID == jobId);
      let userId = document.querySelector(".user-greet").dataset.id
      selectJob["companyLogo"] = selectJob["company_logo"]
      delete selectJob.company_logo
      selectJob["companyUrl"] = selectJob["company_url"]
      delete selectJob.company_url
      selectJob["howToApply"] = selectJob["how_to_apply"]
      delete selectJob.how_to_apply
      renderJobDetails(selectJob);
      addRemoveButton(selectJob, userId);
    }
  })
}

function renderJobDetails(job){
  jobDetailCont.innerHTML = "";
  let userId = document.querySelector(".user-greet").dataset.id
  let jobDeets = document.createElement('div');
  jobDeets.className = "job-full-details";
  if(job.companyLogo == null && job.companyUrl == null){
    jobDeets.innerHTML = `<h2>${job.title}</h2>
    <small>${job.jobType} - ${job.location}</small>
    <div class="company-details"><p>${job.company}<p>
    </div>
    ${job.description}
    ${job.howToApply}`
    // jobDetailCont.appendChild(jobDeets);
  } else if(job.companyLogo == null){
    jobDeets.innerHTML = `<h2>${job.title}</h2>
    <small>${job.jobType} - ${job.location}</small>
    <div class="company-details"><p>${job.company}<p>
    <a href=${job.companyUrl} target="_blank">${job.company}'s Website</a>
    </div>
    ${job.description}
    ${job.howToApply}`
    // jobDetailCont.appendChild(jobDeets);
  } else if (job.companyUrl == null){
    jobDeets.innerHTML = `<h2>${job.title}</h2>
    <small>${job.jobType} - ${job.location}</small>
    <div class="company-details"><p>${job.company}<p>
    <img src="${job.companyLogo}" alt="${job.company} logo">
    </div>
    ${job.description}
    ${job.howToApply}`
    // jobDetailCont.appendChild(jobDeets);
  } else {
  jobDeets.innerHTML = `<h2>${job.title}</h2>
  <small>${job.jobType} - ${job.location}</small>
  <div class="company-details"><p>${job.company}<p>
  <img src="${job.companyLogo}" alt="${job.company} logo">
  <a href=${job.companyUrl} target="_blank">${job.company}'s Website</a>
  </div>
  ${job.description}
  ${job.howToApply}`
  }
  let links = jobDeets.querySelectorAll('a:last-of-type')
  links.forEach((link) => link.target = "_blank")
  setUserThenEmailBtn(jobDeets,job)
  jobDetailCont.appendChild(jobDeets);
  // ;
}
function setUserThenEmailBtn(jobDeets,job){
  let userId = document.querySelector(".user-greet").dataset.id
   fetch(`http://localhost:3000/users/find/${userId}`)
  .then (res=>res.json())
  .then (json => createEmailBtn(jobDeets,json,job))
}

function createEmailBtn(jobDeets,user,job){
let subject=`${job.title} at ${job.company}`
let body=jobBody(job)

//
  let emailBtn=document.createElement('button')
  emailBtn.className="email-button"
  emailBtn.innerText="Email this Job"
  emailBtn.dataset.id=job.id

  jobDeets.appendChild(emailBtn)

  emailBtn.addEventListener('click',function(){

fetch(`http://localhost:3000/users/email/${user.user.id}`,{
  method:"POST",
  body: JSON.stringify({
    username:subject,
    name:body
  }),
  headers: {
    "content-type": "application/json",
    "accepts": "application/json"
  }
}).then(alert('Job Emailed'))

jobDeets.appendChild(emailBtn)
  })
}


function jobBody(job){
let body= "Job Title: "+ job.title + "\n" + "Company: "+ job.company + "\n" + "Location: "+ job.location + "\n" + "Type: "+job.jobType + "\n" + "Description:"+ job.description + "\n" +"Company URL: "+job.companyUrl
body=body.replace(/<(.|\n)*?>/g,'')
return body
}


function handleSaveButtonClicks(){
  jobDetailCont.addEventListener('click', function(e){
    if(e.target.className == "save-job-button"){
      let jobId = e.target.dataset.id;
      let job = store.jobs.find(job => job.id == jobId);
      addJobToDB(job);
    }
  })
}

function addJobToDB(job){
  fetch(`http://localhost:3000/jobs/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accepts": "application/json"
    },
    body: JSON.stringify({
      "title": job.title,
      "location": job.location,
      "jobType": job.jobType,
      "description": job.description,
      "how_to_apply": job.howToApply,
      "company": job.company,
      "company_url": job.companyUrl,
      "company_logo": job.companyLogo,
      "apiID": job.apiId
    })
  })
    .then(res => res.json())
    .then(json => addJobToUserList(json))
}

function addJobToUserList(job){
  let userId = document.querySelector(".user-greet").dataset.id
  fetch(`http:localhost:3000/userjoblists`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accepts": "application/json"
    },
    body: JSON.stringify({
      "user_id": userId,
      "job_id": job.id
    })
  })
  jobDetailCont.querySelector(".save-job-button").disabled = true;
  jobDetailCont.querySelector(".save-job-button").innerText = "Job Saved to List";
}

function checkIfJobExists(job, userId){
  return fetch(`http://localhost:3000/userjoblists/${job.apiId}/${userId}`)
    .then(res => res.json())
}

function addSaveButton(job, boolean){
  let userId = document.querySelector(".user-greet").dataset.id
  let saveBtn = document.createElement('button');
  saveBtn.className = "save-job-button";
  saveBtn.dataset.id = job.id;
  saveBtn.innerText = "Save Job to List"
  if(boolean){
    saveBtn.innerText = "Job Saved to List"
    saveBtn.disabled = true;
  }
  let jobDeets = document.querySelector(".job-full-details")
  jobDeets.appendChild(saveBtn);
}

function addRemoveButton(job){
  let userId = document.querySelector(".user-greet").dataset.id;
  let removeBtn = document.createElement('button');
  removeBtn.className = "remove-job-button";
  removeBtn.dataset.id = job.id;
  removeBtn.innerText = "Remove Job from List";
  jobDetailCont.appendChild(removeBtn);
}

function handleRemoveButtonClicks(){
  jobDetailCont.addEventListener('click', function(e){
    if(e.target.className == "remove-job-button"){
      let jobId = e.target.dataset.id;
      let job = store.user_jobs[0].find(job => job.id == jobId);
      let userId = document.querySelector(".user-greet").dataset.id
      let jobApiId = job.apiID;
      let jobListing = document.querySelector(`[data-id="${jobApiId}"]`)
      jobListing.remove();
      jobDetailCont.innerHTML = "";
      removeJobfromUserlist(job, userId);
    }
  })
}

function removeJobfromUserlist(job, userId){
  fetch(`http://localhost:3000/userjoblists/${userId}/${job.id}`, {
    method: "DELETE"
  }).then(res => console.log("success"))
}

function createLogoutButton(){
  let logout = document.createElement("div");
  logout.className = "log-out-button";
  logout.innerText = "Log Out";
  logout.addEventListener('click', function(e){
    init()
  });
  navbar.appendChild(logout);
}
