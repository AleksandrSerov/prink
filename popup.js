const HIDE_WIP_PRS_ID = "hideWipPrs";
const HIDE_FAILED_PRS_ID = "hideFailedPrs";
const HIDE_CONFLICT_PRS_ID = "hideConflictPrs";
const HIDE_REVIEWED_PRS_ID = "hideReviewedPrs";

const ids = [
  HIDE_WIP_PRS_ID,
  HIDE_FAILED_PRS_ID,
  HIDE_CONFLICT_PRS_ID,
  HIDE_REVIEWED_PRS_ID,
];
window.addEventListener("load", () => {
  ids.forEach(handleSetInitialValue(chrome.storage.sync.get));
  ids.forEach((id) => {
    const checkbox = document.getElementById(id);
    checkbox.addEventListener("change", handleSetValue(id));
  });
});

const handleSetValue = (key) => (event) => {
  chrome.storage.sync.set({ [key]: event.target.checked });
};

const handleSetInitialValue = (get) => (id) => {
  get(id, (result) => {
    const checkbox = document.getElementById(id);

    checkbox.checked = result[id];
  });
};
