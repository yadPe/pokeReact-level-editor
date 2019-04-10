const editor = {
    blockX: 1,
    blockY: 1
}
const makeGrid = () => {
    for (let i = 0; i < editor.blockY; i++) {
        let row = document.createElement('tr');
        row.className = `tr${i}`
        table.appendChild(row)
        for (let j = 0; j < editor.blockX; j++) {
            let cell = document.createElement('td')
            cell.className = `td${j}`
            row.appendChild(cell)
        }
    }
}


const loadExistingTable = (myArray) => {
    var result = "<table id='editorGrid'>";
    for (var i = 0; i < myArray.length; i++) {
        result += "<tr>";
        for (var j = 0; j < myArray[i].length; j++) {
            result += `<td><div class='dragItem' id='${myArray[i][j]}'></div></td>`;
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}



let table = document.getElementById('editorGrid');
const dragItems = document.getElementsByClassName('dragItem');
const assetsTable = document.getElementById('assets');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');

let lastClick;

editor.blockX = localStorage.getItem('width') || 1
editor.blockY = localStorage.getItem('height') || 1


table.ondrop = (e) => drop(e)
table.ondragover = (e) => allowDrop(e)



const resetEditor = () => {
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    localStorage.removeItem('export');
    makeGrid();

    table.addEventListener('click', click)

    table.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!e.target.classList.contains('dragItem')) return
        e.target.parentElement.removeChild(e.target)
    })

}
resetBtn.addEventListener('click', resetEditor)
const click = e => {
    if (e.target.id === 'editorGrid') return
    if (!e.target.classList.contains('dragItem'))
        e.target.appendChild(document.getElementById(lastClick).cloneNode());
    if (e.target.classList.contains('dragItem'))
        lastClick = e.target.id;
}



for (let i = 0; i < dragItems.length; i++) {
    dragItems[i].draggable = true;
    dragItems[i].ondragstart = (e) => drag(e)
    dragItems[i].addEventListener('click', click)
}



const drag = e => {
    e.dataTransfer.setData("text", e.target.id);
}

const drop = e => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
}

const allowDrop = e => {
    e.preventDefault();
}


document.getElementById('fileUpload')
    .addEventListener('change', loadFiles, false);



function loadFiles(e) {
    const files = event.target.files || e.originalTarget.files;

    const rowLength = files.length / 4
    for (let i = 0; i < rowLength; i++) {
        const row = assetsTable.insertRow(0)
    }

    const tilesDB = {}

    for (let i = 0; i < files.length; i++) {

        const fileType = files[i].name.split('.').pop();
        const fileCategory = files[i].name.split('-')[1].split('.').slice()[0];
        const fileId = files[i].name.split('-').slice()[0];

        const row = assetsTable.rows[0]
        const cell = row.insertCell(0);

        const tile = document.createElement('div');
        tile.className = `dragItem ${fileCategory}`
        tile.style.backgroundImage = `url(${URL.createObjectURL(files[i])})`

        const style = document.createElement('style');
        style.type = 'text/css';
        const css = `[id='${fileId}'] {background-image: url(${URL.createObjectURL(files[i])})}; `
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style); 


        // ./tiles/
        // //
        
        tilesDB[fileId] = `../../../assets/tiles/${files[i].name}`
        


        // //



        tile.setAttribute('id', fileId)
        tile.addEventListener('click', click)
        cell.appendChild(tile)
    }
    console.log(JSON.stringify(tilesDB))


}




const updateGrid = (e) => {
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    if (e.target.id === 'width') {
        editor.blockX = e.target.value
        localStorage.setItem('width', e.target.value)
    }
    if (e.target.id === 'height') {
        editor.blockY = e.target.value
        localStorage.setItem('height', e.target.value)
    }
    makeGrid()

}

const exportMatrix = (clicked) => {
    let output = [];
    for (let i = 0, row; row = table.rows[i]; i++) {
        let rowOut = [];

        for (let j = 0, cell; cell = row.cells[j]; j++) {
            rowOut.push(parseInt(cell.firstChild ? cell.firstChild.id : 0))
        }

        output.push(rowOut);
    }
    localStorage.setItem('export', JSON.stringify(output))
    if (clicked) {
        const el = document.createElement('textarea');
        el.value = JSON.stringify(output);
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('copied to clipboard')
    };

    return JSON.stringify(output)
}

exportBtn.addEventListener('click', () => exportMatrix(true))

setInterval(exportMatrix, 35000)



const filterAssets = (e) => {
    const query = e.target.value
    const tr = assetsTable.getElementsByTagName("td");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("div")[0];
        if (td) {
            txtValue = td.className.split(' ')[1]
            if (txtValue.includes(query)) {
                td.style.display = "";
            } else {
                td.style.display = "none";
            }
        }
    }
}


if (localStorage.getItem('export')) {
    const ed = document.getElementById('editor');
    ed.innerHTML = loadExistingTable(JSON.parse(localStorage.getItem('export')))
    table = document.getElementById('editorGrid');
} else {
    makeGrid()
    table = document.getElementById('editorGrid');
}

table.addEventListener('click', click)

table.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!e.target.classList.contains('dragItem')) return
    e.target.parentElement.removeChild(e.target)
})


//Import 

importBtn = document.getElementById('importBtn')


const importArr = (e) => {
    const ed = document.getElementById('editor');
    ed.innerHTML = loadExistingTable(JSON.parse(document.getElementById('import').value))
    
    table = document.getElementById('editorGrid');

    table.addEventListener('click', click)

    table.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!e.target.classList.contains('dragItem')) return
        e.target.parentElement.removeChild(e.target)
    })

}

importBtn.addEventListener('click', importArr)