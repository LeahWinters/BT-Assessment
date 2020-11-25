// How I grab elements from the html and make them into variables for later use
var getDataBtn = document.querySelector(".get-data-btn");
var verifyDatesBtn = document.querySelector(".verify-dates-btn");
var compareLengthBtn = document.querySelector(".compare-lengths-btn");

// How I let the dom know when an event of a click happens, invoke the click handler
getDataBtn.addEventListener("click", (event) => {
  handleClick(event);
});
verifyDatesBtn.addEventListener("click", (event) => {
  handleClick(event);
});
compareLengthBtn.addEventListener("click", (event) => {
  handleClick(event);
});

// How I dynamically can invoke functions based on what button was clicked
const handleClick = (event) => {
  event.preventDefault();
  if (event.target.classList.contains("get-data-btn")) {
    displayAllData();
  } else if (event.target.classList.contains("verify-dates-btn")) {
    verifyDates();
  } else if (event.target.classList.contains("compare-lengths-btn")) {
    getAllReposData();
  }
};

// Helper function that fetches and displays all needed data/error messages
const displayAllData = () => {
  displayReposIds();
  displayEventsIds();
  displayHooksErrorMessage();
  displayIssuesErrorMessage();
  displayMembersErrorMessage();
  displayPublicMembersErrorMessage();
};

// Reusable function that parses the data for me or gives me an error to help me determine where the fetch went wrong
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Fetch for ${url} failed`);
  }
};

// Displays repo id numbers after fetch
const displayReposIds = async () => {
  const repoIdsDiv = document.querySelector(".repos-id-div");
  let reposData = await fetchData(
    "https://api.github.com/orgs/BoomTownROI/repos"
  );

  repoIdsDiv.innerHTML = reposData.map((repo) => {
    return `
      <section class="individual-repo">
        <p>Repo ID: ${repo.id}<p>
      </section>`;
  });
};

// displays event id numbers after fetch
const displayEventsIds = async () => {
  const eventsIdsDiv = document.querySelector(".events-id-div");
  let eventsData = await fetchData(
    "https://api.github.com/orgs/BoomTownROI/events"
  );

  eventsIdsDiv.innerHTML = eventsData.map((event) => {
    return `
      <section class="individual-event">
        <p>Event ID: ${event.id}<p>
      </section>`;
  });
};

// displays hooks error after fetch
const displayHooksErrorMessage = async () => {
  const hooksIdsDiv = document.querySelector(".hooks-id-div");
  let hooksData = await fetchData(
    "https://api.github.com/orgs/BoomTownROI/hooks"
  );

  if (hooksData.message === "Not Found") {
    hooksIdsDiv.innerHTML = `<section class="individual-hook">
        <p>No Hooks Found<p>
      </section>`;
  } else {
    hooksIdsDiv.innerHTML = hooksData.map((hook) => {
      return `
      <section class="individual-event">
        <p>Hook ID: ${hook.id}<p>
      </section>`;
    });
  }
};

// displays issues error after fetch
const displayIssuesErrorMessage = async () => {
  const issuesIdsDiv = document.querySelector(".issues-id-div");
  let issuesData = await fetchData(
    "https://api.github.com/orgs/BoomTownROI/issues"
  );

  if (issuesData.message === "Not Found") {
    issuesIdsDiv.innerHTML = `<section class="individual-issue">
        <p>No Issues Found<p>
      </section>`;
  } else {
    issuesIdsDiv.innerHTML = issuesData.map((issue) => {
      return `
      <section class="individual-issue">
        <p>Issue ID: ${issue.id}<p>
      </section>`;
    });
  }
};

// displays members error after fetch
const displayMembersErrorMessage = async () => {
  const membersIdsDiv = document.querySelector(".members-id-div");
  let membersData = await fetchData(
    "https://api.github.com/orgs/BoomTownROI/members{/member}"
  );

  if (membersData.message === "Not Found") {
    membersIdsDiv.innerHTML = `<section class="individual-member">
       <p>No Members Found<p>
     </section>`;
    console.log(membersData);
  } else {
    membersIdsDiv.innerHTML = membersData.map((member) => {
      return `
     <section class="individual-member">
       <p>Member ID: ${member.id}<p>
     </section>`;
    });
  }
};

// displays public members error after fetch
const displayPublicMembersErrorMessage = async () => {
  const publicMembersIdsDiv = document.querySelector(".public-members-id-div");
  let publicMembersData = await fetchData(
    "https://api.github.com/orgs/BoomTownROI/public_members{/member}"
  );

  if (publicMembersData.message === "Not Found") {
    publicMembersIdsDiv.innerHTML = `<section class="individual-public-members">
       <p>No Public Members Found<p>
     </section>`;
  } else {
    publicMembersIdsDiv.innerHTML = publicMembersData.map((member) => {
      return `
     <section class="individual-public-member">
       <p>Public Member ID: ${member.id}<p>
     </section>`;
    });
  }
};

const verifyDates = async () => {
  const verifyDateDiv = document.querySelector(".verify-result-div");
  let topLevelData = await fetchData("https://api.github.com/orgs/BoomTownROI");

  // grabs the given date from the top level
  let originalCreateDate = await topLevelData.created_at;
  let originalUpdateDate = await topLevelData.updated_at;
  
  // converts the original given date to numbers I can use to compare to each other
  let newCreateDate = new Date(originalCreateDate);
  let newUpdateDate = new Date(originalUpdateDate);

  // compares and displays text on dom based on the result
  if (newCreateDate < newUpdateDate) {
    verifyDateDiv.innerHTML = `Update date is newer then create date.`;
  } else {
    verifyDateDiv.innerHTML = `Update date is older then create date.`;
  }
};

const getAllReposData = async () => {
  // Top level object
  const publicRepos = await fetchData(
    "https://api.github.com/orgs/BoomTownROI"
  );

  // Since the api only serves 30 objects at a time for /repos, I need to know how many pages I need to pull
  let cyclesNeeded = Math.ceil(publicRepos.public_repos / 30);
  let repoCount = 0;

  // I iterate over /repos with a forLoop with the cyclesNeeded as the benchmark for i
  for (i = 1; i <= cyclesNeeded; i++) {
    repoCount += await iterateRepos(i);
  }

  // Helper function invocation with the arguments of the total repo objects from all pages and the public repos value (number)
  compareReposLengths(repoCount, publicRepos.public_repos);
};

const iterateRepos = async (i) => {
  let data = await fetchData(
    `https://api.github.com/orgs/BoomTownROI/repos?page=${i}`
  );
  // Returns the total number of objects from fetch of each page
  return data.length;
};

const compareReposLengths = async (reposLength, publicRepos) => {
  const resultsDiv = document.querySelector(".lengths-result-div");

  if (reposLength === publicRepos) {
    resultsDiv.innerHTML = `They are the same length.`;
  } else {
    resultsDiv.innerHTML = `They are not the same length.`;
  }
};
