let data = {
  "Title 1": [
    {
      stage: 1,
      content: ` digraph G {
    subgraph cluster_0 {
      style=filled;
      color=lightgrey;
      node [style=filled,color=white];
      a0 -> a1 -> a2 -> a3;
      label = "process #1";
    }
    subgraph cluster_1 {
      node [style=filled];
      b0 -> b1 -> b2 -> b3;
      label = "process #2";
      color=blue
    }
    start -> a0;
    start -> b0;
    a1 -> b3;
    b2 -> a3;
    a3 -> a0;
    a3 -> end;
    b3 -> end;
    start [shape=Mdiamond];
    end [shape=Msquare];
  }`,
      content2: "Code Of stage 1",
    },
    { stage: 2, content: "code stage 2 Title 1" },
  ],
  "Title 2": [
    { stage: 1, content: "code stage 1 Title 2" },
    { stage: 2, content: "code stage 2 Title 2" },
  ],
};

data = {
  "Hot-Cold": [
    {
      stage: 1,
      content: ` digraph G {
    subgraph cluster_0 {
      style=filled;
      color=lightgrey;
      node [style=filled,color=white];
      a0 -> a1 -> a2 -> a3;
      label = "process #1";
    }
    subgraph cluster_1 {
      node [style=filled];
      b0 -> b1 -> b2 -> b3;
      label = "process #2";
      color=blue
    }
    start -> a0;
    start -> b0;
    a1 -> b3;
    b2 -> a3;
    a3 -> a0;
    a3 -> end;
    b3 -> end;
    start [shape=Mdiamond];
    end [shape=Msquare];
  }`,
      content2: `Int x = 0 
  x+=1`,
    },
    {
      stage: 2,
      content: "code stage 2 Hot-Cold",
    },
  ],

  stadiums: [
    {
      stage: 1,
      content: "code stage 1 stadiums",
    },
    {
      stage: 2,
      content: "code stage 2 stadiums",
    },
  ],
};

document.addEventListener("DOMContentLoaded", function () {
  const menuContainer = document.getElementById("menu");
  const contentContainer = document.getElementById("content");
  let activeSubmenu = null;

  function createMenu() {
    for (const title in data) {
      const titleElement = document.createElement("div");
      titleElement.classList.add("title");
      titleElement.textContent = "▶ " + title;

      const stages = data[title].map((item) => item.stage);

      titleElement.addEventListener("click", function () {
        const isActive = titleElement.classList.toggle("active");
        titleElement.textContent = isActive ? "▼ " + title : "▶ " + title;
        if (isActive) {
          activeSubmenu = createSubMenu(stages, title, titleElement);
        } else {
          titleElement.removeChild(activeSubmenu);
          activeSubmenu = null;
          contentContainer.textContent = ""; // Clear content if title is collapsed
        }
      });

      menuContainer.appendChild(titleElement);
    }
  }

  function createSubMenu(stages, title, titleElement) {
    const submenu = document.createElement("div");
    submenu.classList.add("submenu");

    stages.forEach((stage) => {
      const stageElement = document.createElement("div");
      stageElement.classList.add("stage");
      stageElement.textContent = "Stage " + stage;

      stageElement.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent bubbling to title click event
        displayContent(title, stage);
      });

      submenu.appendChild(stageElement);
    });

    titleElement.appendChild(submenu);
    return submenu;
  }

  function displayContent(title, stage) {
    const content1Display = document.getElementById("content1");
    const content2Display = document.getElementById("content2");
    content2Display.innerHTML = "";

    const selectedData = data[title].find((item) => item.stage === stage);
    if (selectedData) {
      const dotCode = selectedData.content;
      const graphDiv = document.getElementById("content1");
      const viz = new Viz();
      viz
        .renderSVGElement(dotCode)
        .then((element) => {
          graphDiv.textContent = "";
          graphDiv.appendChild(element);
        })
        .catch((error) => {
          graphDiv.textContent = "Not A dot code";
          console.error(error);
        });

      try {
        //content2Display.innerHTML = selectedData.content2;
        selectedData.content2 = selectedData.content2.replace(/\n/g, "<br>");
        content2Display.innerHTML = selectedData.content2;
        //content2Display.textContent = selectedData.content2;
        if (
          selectedData.content2.trim() === "" ||
          selectedData.content2 === null
        ) {
          content2Display.style.backgroundColor = "";
        } else {
          content2Display.style.backgroundColor = "#f2f2f2";
        }
      } catch {
        content2Display.style.backgroundColor = "";
      }
      //contentContainer.textContent = selectedData.content;
    }
  }

  document.addEventListener("click", function (event) {
    if (activeSubmenu && !menuContainer.contains(event.target)) {
      activeSubmenu.parentNode.removeChild(activeSubmenu);
      activeSubmenu = null;
      clearContent();
    }
  });

  createMenu();
});
