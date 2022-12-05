const formatFeatureName = (name) => {
  return `${name[0].toUpperCase()}${name
    .toLowerCase()
    .replaceAll("_", " ")
    .slice(1)}`;
};

const handleInputChange = (featureName) => (e) => {
  chrome.storage.sync.get("features", (result) => {
    const currentFeaturesConfig = result.features;

    const updatedFeaturesConfig = {
      ...currentFeaturesConfig,
      [featureName]: e.target.checked,
    };

    chrome.storage.sync.set({ features: updatedFeaturesConfig });
  });
};

const Header = () => {
  const headerNode = document.createElement("h2");
  headerNode.textContent = "Features";
  headerNode.classList.add("header");

  return headerNode;
};

const Container = (...children) => {
  console.log(children);
  const containerNode = document.createElement("div");
  containerNode.classList.add("container");

  children.forEach((child) => {
    containerNode.appendChild(child);
  });

  return containerNode;
};

const FeaturesLink = () => {
  const featuresLink = document.createElement("a");
  featuresLink.setAttribute(
    "href",
    `https://www.uulastaging.com/account/features`
  );
  featuresLink.setAttribute("target", "_blank");
  featuresLink.classList.add("link");
  featuresLink.textContent = "Go to features";

  return featuresLink;
};

const Feature = ({ featureName, featureValue }) => {
  const label = document.createElement("label");
  label.classList.add("label");

  const input = document.createElement("input");
  input.classList.add("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", featureName);
  input.addEventListener("change", handleInputChange(featureName));

  if (featureValue) {
    input.setAttribute("checked", "true");
  }

  const span = document.createElement("span");
  span.textContent = formatFeatureName(featureName);

  label.appendChild(input);
  label.appendChild(span);

  return label;
};
const FeaturesList = (features) => {
  const featuresNodes = Object.entries(features).map(
    ([featureName, featureValue]) => Feature({ featureName, featureValue })
  );
  const fragment = document.createElement("div");

  featuresNodes.forEach((node) => {
    fragment.appendChild(node);
  });

  return fragment;
};

const App = (features) => {
  const root = document.getElementById("root");
  root.innerHTML = "";

  return Container(Header(), FeaturesLink(), FeaturesList(features));
};

const handleSetValue = (key) => (event) => {
  chrome.storage.sync.set({ [key]: event.target.checked });
};

const handleSetInitialValue = (get) => (id) => {
  get(id, (result) => {
    const checkbox = document.getElementById(id);

    checkbox.checked = result[id];
  });
};

const main = () => {
  chrome.storage.sync.get("features", (result) => {
    const root = document.getElementById("root");
    root.innerHTML = "";

    root.appendChild(App(result.features));
  });

  chrome.storage.onChanged.addListener((result) => {
    const root = document.getElementById("root");
    root.innerHTML = "";

    root.appendChild(App(result.features.newValue));
  });
};

main();
