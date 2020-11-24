var repoIdsDiv = document.querySelector(".repos-id-div");

let reposData;

reposData = fetch("https://api.github.com/orgs/BoomTownROI/repos")
  .then((data) => data.json())
  .then((data) => data)
  .catch((error) => console.log(error.message));

Promise.all([reposData])
  .then((data) => {
    repos = data;
  })
  .then(() => {
    displayReposIds(repos);
  })
  .catch((error) => {
    console.log(error.message);
  });

const displayReposIds = (repos) => {
  repoIdsDiv.innerHTML = repos[0].map((repo) => {
      console.log(repo.id);
      return `
        <section>
          <p>Repo ID: ${repo.id}<p>
        </section>`;
  })
};
