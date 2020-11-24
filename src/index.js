var repoIdsDiv = document.querySelector(".repos-id-div");
var eventsIdsDiv = document.querySelector(".events-id-div");
var hooksIdsDiv = document.querySelector(".hooks-id-div");
var issuesIdsDiv = document.querySelector(".issues-id-div");

let reposData;
let eventsData;
let hooksData;
let issuesData;

reposData = fetch("https://api.github.com/orgs/BoomTownROI/repos")
  .then((data) => data.json())
  .then((data) => data)
  .catch((error) => console.log(error.message));

eventsData = fetch("https://api.github.com/orgs/BoomTownROI/events")
  .then((data) => data.json())
  .then((data) => data)
  .catch((error) => console.log(error.message));

hooksData = fetch("https://api.github.com/orgs/BoomTownROI/hooks")
  .then((data) => data.json())
  .then((data) => data.message)
  .catch((error) => console.log(error.message));

issuesData = fetch("https://api.github.com/orgs/BoomTownROI/issues")
  .then((data) => data.json())
  .then((data) => data.message)
  .catch((error) => console.log(error.message));

Promise.all([reposData, eventsData, hooksData, issuesData])
  .then((data) => {
    reposData = data;
    eventsData = data;
    hooksData = data;
    issuesData = data;
  })
  .then(() => {
    displayReposIds(reposData);
    displayEventsIds(eventsData);
    displayHooksErrorMessage(hooksData);
    displayIssuesErrorMessage(issuesData);
  })
  .catch((error) => {
    console.log(error.message);
  });

const displayReposIds = (repos) => {
  repoIdsDiv.innerHTML = repos[0].map((repo) => {
    return `
      <section class="individual-repo">
        <p>Repo ID: ${repo.id}<p>
      </section>`;
  });
};

const displayEventsIds = (events) => {
  eventsIdsDiv.innerHTML = events[1].map((event) => {
    return `
      <section class="individual-event">
        <p>Event ID: ${event.id}<p>
      </section>`;
  }); 
};

const displayHooksErrorMessage = (hooks) => {
  if (hooks[2] === "Not Found") {
     hooksIdsDiv.innerHTML = `<section class="individual-hook">
        <p>No Hooks Found<p>
      </section>`;
      console.log(hooks[2]);
  } else {
    hooksIdsDiv.innerHTML = hooks[2].map((hook) => {
      return `
      <section class="individual-event">
        <p>Hook ID: ${hook.id}<p>
      </section>`;
    })
  }
}

const displayIssuesErrorMessage = (issues) => {
  if (issues[3] === "Not Found") {
     issuesIdsDiv.innerHTML = `<section class="individual-issue">
        <p>No Issues Found<p>
      </section>`;
      console.log(issue[3]);
  } else {
    issuesIdsDiv.innerHTML = issues[3].map((issue) => {
      return `
      <section class="individual-issue">
        <p>Issue ID: ${issue.id}<p>
      </section>`;
    })
  }
}