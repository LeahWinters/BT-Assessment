var repoIdsDiv = document.querySelector(".repos-id-div");
var eventsIdsDiv = document.querySelector(".events-id-div")

let reposData;
let eventsData;

reposData = fetch("https://api.github.com/orgs/BoomTownROI/repos")
  .then((data) => data.json())
  .then((data) => data)
  .catch((error) => console.log(error.message));

eventsData = fetch("https://api.github.com/orgs/BoomTownROI/events")
  .then((data) => data.json())
  .then((data) => data)
  .catch((error) => console.log(error.message));

Promise.all([reposData, eventsData])
  .then((data) => {
    reposData = data;
    eventsData = data;
  })
  .then(() => {
    displayReposIds(reposData);
    displayEventsIds(eventsData);
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
  console.log(events[1], "events");
  eventsIdsDiv.innerHTML = events[1].map((event) => {
    return `
      <section class="individual-event">
        <p>Repo ID: ${event.id}<p>
      </section>`;
  });
};
