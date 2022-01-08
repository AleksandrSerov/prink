const dashboard = document.querySelector("h2");
const filters = document.createElement("div");
const hiddenPrsCountNode = document.createElement("div");
hiddenPrsCountNode.textContent = "Hidden prs count - ";
const blueButton = document.createElement("button");
blueButton.setAttribute("class", "aui-button");

const hideFailedPrsButton = blueButton.cloneNode();
hideFailedPrsButton.textContent = "Hide failed prs";
const hideWipPrsButton = blueButton.cloneNode();
hideWipPrsButton.textContent = "Hide wip prs";
const hideConflictPrsButton = blueButton.cloneNode();
hideConflictPrsButton.textContent = "Hide conflict prs";
const hideReviewedPrsButton = blueButton.cloneNode();
hideReviewedPrsButton.textContent = "Hide reviewed prs";
const resetButton = blueButton.cloneNode();
resetButton.textContent = "Reset";

const getPrs = () =>
  document.querySelectorAll(
    ".dashboard-pull-requests-table-reviewing > table > tbody > tr"
  );

const getHiddenPrsCount = () => {
  const prs = getPrs();
  let count = 0;
  prs.forEach((pr) => {
    if (pr.getAttribute("style") === "display: none") {
      count += 1;
    }
  });
  return count;
};

const handleHideWipPrs = () => {
  const pullRequests = getPrs();
  pullRequests.forEach((pr) => {
    const prName = pr
      .querySelector(".summary > .title > a")
      .textContent.toLowerCase();

    if (prName.includes("wip")) {
      pr.setAttribute("style", "display: none");
    }
  });
  updateHiddenPrsCount();
};

const handleHideConflictPrs = () => {
  const pullRequests = getPrs();
  pullRequests.forEach((pr) => {
    if (pr.querySelector(".conflict").textContent === "Conflict") {
      pr.setAttribute("style", "display: none");
    }
  });
  updateHiddenPrsCount();
};

const handleHideReviewedPrs = () => {
  const pullRequests = getPrs();
  pullRequests.forEach((pr) => {
    console.log(
      pr.querySelector(
        ".reviewers > .reviewer-avatar-list > .user-avatar > .badge"
      )
    );
    if (
      !pr
        .querySelector(
          ".reviewers > .reviewer-avatar-list > .user-avatar > .badge"
        )
        .classList.contains("badge-hidden")
    ) {
      pr.setAttribute("style", "display: none");
    } else if (
      !pr
        .querySelectorAll(
          ".reviewers > .reviewer-avatar-list > .user-avatar > .badge"
        )[1]
        .classList.contains("badge-hidden")
    ) {
      pr.setAttribute("style", "display: none");
    }
  });
  updateHiddenPrsCount();
};

// DOESN'T WORK YET
const fetchPrInfo = ({ projectName, repoName, prId }) => {
  const projectMap = {
    // NAMES for projects
    // key - human name, value - bitbucket name
    "****": "****",
    "****": "****",
    "****": "****",
    "****": "****",
  };

  if (!projectMap[projectName]) {
    return Promise.resolve({
      failed: 0,
      inProgress: 0,
      successful: 1,
    });
  }

  // URL bitBucket
  const host = window.host;
  const url = window.url;
  return fetch(url).then((response) => response.json());
};


// DOESN'T WORK YET
const handleHideFailedPrs = async () => {
  return false;
  const pullRequests = getPrs();

  pullRequests.forEach(async (pr) => {
    const projectName = pr.querySelector(
      ".summary > .meta > .project-and-repository > .project-name"
    ).textContent;
    const prId = pr
      .querySelector(".summary > .meta > .pull-request-id")
      .textContent.slice(1);
    const repoName = pr.querySelector(
      ".summary > .meta > .project-and-repository > .name"
    ).textContent;
    await fetchPrInfo({ projectName, repoName, prId }).then((response) => {
      if (response[prId]?.successful !== 1) {
        pr.setAttribute("style", "display: none");
      }
    });
    updateHiddenPrsCount();
  });
};

const handleResetPrs = () => {
  const pullRequests = getPrs();
  pullRequests.forEach((pr) => {
    pr.removeAttribute("style");
  });
  updateHiddenPrsCount();
};

const hideWipPrsWithConfig = () => {
  chrome.storage.sync.get("hideWipPrs", (result) => {
    if (result.hideWipPrs) {
      handleHideWipPrs();
      updateHiddenPrsCount();
    }
  });
};
const hideFailedPrsWithConfig = () => {
  chrome.storage.sync.get("hideFailedPrs", async (result) => {
    if (result.hideFailedPrs) {
      await handleHideFailedPrs();
      updateHiddenPrsCount();
    }
  });
};
const hideConflictPrsWithConfig = () => {
  chrome.storage.sync.get("hideConflictPrs", (result) => {
    if (result.hideConflictPrs) {
      handleHideConflictPrs();
      updateHiddenPrsCount();
    }
  });
};

const hideReviewedPrsWithConfig = () => {
  chrome.storage.sync.get("hideReviewedPrs", (result) => {
    if (result.hideReviewedPrs) {
      handleHideReviewedPrs();
      updateHiddenPrsCount();
    }
  });
};

hideFailedPrsButton.addEventListener("click", handleHideFailedPrs);
hideWipPrsButton.addEventListener("click", handleHideWipPrs);
hideConflictPrsButton.addEventListener("click", handleHideConflictPrs);
hideReviewedPrsButton.addEventListener("click", handleHideReviewedPrs);
resetButton.addEventListener("click", handleResetPrs);

filters.appendChild(hideFailedPrsButton);
filters.appendChild(hideWipPrsButton);
filters.appendChild(hideConflictPrsButton);
filters.appendChild(hideReviewedPrsButton);
filters.appendChild(resetButton);
filters.appendChild(hiddenPrsCountNode);
dashboard.parentNode.insertBefore(filters, dashboard);

const updateHiddenPrsCount = () => {
  const count = getHiddenPrsCount();
  hiddenPrsCountNode.textContent = `Hidden prs count - ${count}`;
};

const observer = new MutationObserver(async () => {
  hideWipPrsWithConfig();
  hideConflictPrsWithConfig();
  handleHideReviewedPrs();
  await hideFailedPrsWithConfig();
  updateHiddenPrsCount();
});

window.addEventListener("load", async () => {
  const config = {
    childList: true,
    attributes: true,
    attributeFilter: ["style"],
  };

  observer.observe(
    document.querySelector(
      ".dashboard-pull-requests-table-reviewing > table > tbody"
    ),
    config
  );
  hideWipPrsWithConfig();
  hideConflictPrsWithConfig();
  handleHideReviewedPrs();
  await hideFailedPrsWithConfig();
  updateHiddenPrsCount();
});
