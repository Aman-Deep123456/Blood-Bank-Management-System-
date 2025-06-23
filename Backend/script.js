// script.js
// Define a class for Folder
class Folder {
    constructor(name) {
        this.name = name;
        this.contents = [];
        this.isOpen = false;
        this.type = "folder";
    }

    addItem(item) {
        this.contents.push(item);
    }
}

// Create a sample folder structure using static data with initial file data
const folderA = new Folder("Folder A");
const folderB = new Folder("Folder B");
const folderC = new Folder("Folder C");

const subfolderA1 = new Folder("Subfolder A1");
const subfolderA2 = new Folder("Subfolder A2");
const subfolderB1 = new Folder("Subfolder B1");
const subfolderB2 = new Folder("Subfolder B2");
const subfolderC1 = new Folder("Subfolder C1");

// Add files to folders with initial data
folderA.addItem({ type: "file", name: "File A1.txt", data: "Initial content for File A1." });
folderA.addItem({ type: "file", name: "File A2.txt", data: "Another file's content." });
subfolderA1.addItem({ type: "file", name: "File A1_1.txt", data: "Data in a subfolder file." });
subfolderA2.addItem({ type: "file", name: "File A2_1.txt", data: "" });
subfolderA2.addItem(new Folder("Sub-Subfolder A2_1"));

// Add subfolders to folders
folderA.addItem(subfolderA1);
folderA.addItem(subfolderA2);
folderB.addItem(subfolderB1);
folderB.addItem(subfolderB2);
folderC.addItem(subfolderC1);
folderC.addItem({ type: "file", name: "File C1.pdf", data: "PDF data" });

// Array of top-level folders
const topLevelFolders = [folderA, folderB, folderC];

// Get HTML elements
const folderContainer = document.getElementById('folder-container');
const backButton = document.getElementById('back-button');
const currentPathDisplay = document.getElementById('current-path');

// Keep track of current folder and history
let currentFolder = { name: "Home", contents: topLevelFolders }; // Changed initial name to "Home" or ""
const navigationStack = [];

function updateFileData(fileName, newData) {
    function findFile(folders, name) {
        for (const item of folders) {
            if (item.type === "file" && item.name === name) {
                return item;
            } else if (item.type === "folder") {
                const found = findFile(item.contents, name);
                if (found) return found;
            }
        }
        return null;
    }

    const fileToUpdate = findFile(currentFolder.contents, fileName);
    if (fileToUpdate) {
        fileToUpdate.data = newData;
        renderFolderView(currentFolder);
    } else {
        console.log(`File "${fileName}" not found in the current view.`);
    }
}

function createFolderElement(folder) {
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder';
    folderDiv.innerHTML = `<span class="folder-icon"><i class="fas fa-folder"></i></span>${folder.name}`;

    folderDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        navigateToFolder(folder);
    });

    return folderDiv;
}

function createFileElement(file) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file';
    const dataPreview = file.data ? file.data.substring(0, 20) + (file.data.length > 20 ? '...' : '') : '[Empty]';
    fileDiv.innerHTML = `<span class="file-icon"><i class="fas fa-file"></i></span>${file.name} <span class="file-data-preview">(${dataPreview})</span>`;

    fileDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        const newContent = prompt(`Edit content for ${file.name}:`, file.data);
        if (newContent !== null) {
            updateFileData(file.name, newContent);
        }
    });

    return fileDiv;
}

function renderFolderView(folder) {
    folderContainer.innerHTML = '';
    let pathText = navigationStack.map(f => f.name).join(" / ");
    if (folder.name !== "Home") { // Exclude "Home" from the path
        pathText += (pathText ? " / " : "") + folder.name;
    }
    currentPathDisplay.textContent = pathText;

    if (navigationStack.length > 0) {
        backButton.style.display = 'block';
    } else {
        backButton.style.display = 'none';
    }

    folder.contents.forEach(item => {
        if (item.type === "folder") {
            folderContainer.appendChild(createFolderElement(item));
        }
    });

    folder.contents.forEach(item => {
        if (item.type === "file") {
            folderContainer.appendChild(createFileElement(item));
        }
    });
}

function navigateToFolder(folder) {
    navigationStack.push(currentFolder);
    currentFolder = folder;
    renderFolderView(currentFolder);
}

function goBack() {
    if (navigationStack.length > 0) {
        currentFolder = navigationStack.pop();
        renderFolderView(currentFolder);
    } else {
        renderFolderView({ name: "Home", contents: topLevelFolders });
    }
}

backButton.addEventListener('click', goBack);

// Render the initial top-level folders
renderFolderView(currentFolder);
