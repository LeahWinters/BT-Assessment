var repoIdsDiv = document.querySelector(".repos-id-div");
var eventsIdsDiv = document.querySelector(".events-id-div");
var hooksIdsDiv = document.querySelector(".hooks-id-div");
var issuesIdsDiv = document.querySelector(".issues-id-div");
var membersIdsDiv = document.querySelector(".members-id-div");
var publicMembersIdsDiv = document.querySelector(".public-members-id-div");

let reposData;
let eventsData;
let hooksData;
let issuesData;
let membersData;
let publicMembersData;

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

membersData = fetch("https://api.github.com/orgs/BoomTownROI/members{/member}")
  .then((data) => data.json())
  .then((data) => data.message)
  .catch((error) => console.log(error.message));

publicMembersData = fetch("https://api.github.com/orgs/BoomTownROI/public_members{/member}")
  .then((data) => data.json())
  .then((data) => data.message)
  .catch((error) => console.log(error.message));

Promise.all([reposData, eventsData, hooksData, issuesData, membersData, publicMembersData])
  .then((data) => {
    reposData = data;
    eventsData = data;
    hooksData = data;
    issuesData = data;
    membersData = data;
    publicMembersData = data;
  })
  .then(() => {
    displayReposIds(reposData);
    displayEventsIds(eventsData);
    displayHooksErrorMessage(hooksData);
    displayIssuesErrorMessage(issuesData);
    displayMembersErrorMessage(membersData);
    displayPublicMembersErrorMessage(publicMembersData)
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
  } else {
    hooksIdsDiv.innerHTML = hooks[2].map((hook) => {
      return `
      <section class="individual-event">
        <p>Hook ID: ${hook.id}<p>
      </section>`;
    });
  }
};

const displayIssuesErrorMessage = (issues) => {
  if (issues[3] === "Not Found") {
    issuesIdsDiv.innerHTML = `<section class="individual-issue">
        <p>No Issues Found<p>
      </section>`;
  } else {
    issuesIdsDiv.innerHTML = issues[3].map((issue) => {
      return `
      <section class="individual-issue">
        <p>Issue ID: ${issue.id}<p>
      </section>`;
    });
  }
};

const displayMembersErrorMessage = (members) => {
  if (members[4] === "Not Found") {
    membersIdsDiv.innerHTML = `<section class="individual-member">
       <p>No Members Found<p>
     </section>`;
    console.log(members[4]);
  } else {
    membersIdsDiv.innerHTML = members[4].map((member) => {
      return `
     <section class="individual-member">
       <p>Member ID: ${member.id}<p>
     </section>`;
    });
  }
};

const displayPublicMembersErrorMessage = (publicMembers) => {
  if (publicMembers[5] === "Not Found") {
    publicMembersIdsDiv.innerHTML = `<section class="individual-public-members">
       <p>No Public Members Found<p>
     </section>`;
    console.log(publicMembers[5]);
  } else {
    publicMembersIdsDiv.innerHTML = publicMembers[5].map((member) => {
      return `
     <section class="individual-public-member">
       <p>Public Member ID: ${member.id}<p>
     </section>`;
    });
  }
};
