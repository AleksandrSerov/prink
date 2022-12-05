const LS_FEATURES_KEY = "features";

const getFeaturesConfig = () => {
  const featuresString = localStorage.getItem(LS_FEATURES_KEY);

  try {
    const features = JSON.parse(featuresString);

    return features;
  } catch (error) {
    console.error(error);

    return;
  }
};

const updateFeaturesConfig = () => {
  const features = getFeaturesConfig();
  chrome.storage.sync.set({ features });
}

window.addEventListener("load", () => {
  chrome.storage.sync.set({ host: window.location.host });
  // TODO: observer storage change
  setInterval(updateFeaturesConfig, 500);
});

chrome.storage.onChanged.addListener((result) => {
  window.localStorage.setItem('features', JSON.stringify(result.features.newValue));
});