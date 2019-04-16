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
    let result = "<table id='editorGrid'>";
    for (let i = 0; i < myArray.length; i++) {
        result += "<tr>";
        for (let j = 0; j < myArray[i].length; j++) {
            result += '<td>'
            for (let h = 0; h < myArray[i][j].length; h++)
                result += `<div class='dragItem' id='${myArray[i][j][h]}'></div>`;
            result += '</td>'
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

let lastClick = {};

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
    if (e.target.classList.contains('dragItem') && e.target.parentElement.parentElement.parentElement.parentElement.id === 'assets'){
        lastClick.id = e.target.id;
        //lastClick.category = e.target.classList[1]
        return
    }
    if (lastClick.id && e.target.parentElement.nodeName == 'TR'){
        e.target.appendChild(document.getElementById(lastClick.id).cloneNode());
        return
    }
    if (lastClick.id && e.target.parentElement.nodeName == 'TD'){
        for (let i = 0; i< e.target.parentNode.childNodes.length; i++){
            if (e.target.parentNode.childNodes[i].id === lastClick.id) return
            //if (e.target.parentNode.childNodes[i].classList.contains(lastClick.category)) return
        }
        e.target.parentElement.appendChild(document.getElementById(lastClick.id).cloneNode());
        return
    }
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

    assetsTable.width = 35 * files.length;

    for (let i = 0; i < files.length; i++) {

        const fileId = files[i].name.split('-').slice()[0];
        const fileTags = files[i].name.split('-')[1];
        const fileZIndex = files[i].name.split('-')[2].split('.').slice()[0];
        const fileCollide = files[i].name.split('-')[3].split('.').slice()[0].substring(files[i].name.split('-')[3].split('.').slice()[0].indexOf('(')).replace('(', '').replace(')', '');
        const fileType = files[i].name.split('.').pop();
        let zIndex = parseInt(fileZIndex.substring(1, fileZIndex.length));
        // if (!parseInt(zIndex)){
        //     console.log(files[i].name)
        //     console.log(fileZIndex, zIndex)
        // }
        //console.log(fileCollide)
        

        const row = assetsTable.rows[0]
        const cell = row.insertCell(0);

        const tile = document.createElement('div');
        tile.className = `dragItem ${fileTags} ${fileCollide == 1 ? 'collide' : ''}`
        tile.style.backgroundImage = `url(${URL.createObjectURL(files[i])})`

        const style = document.createElement('style');
        style.type = 'text/css';
        const css = `[id='${fileId}'] {background-image: url(${URL.createObjectURL(files[i])}); \n z-index: ${zIndex}}`
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style); 
        tile.setAttribute('id', fileId)
        tile.addEventListener('click', click)
        cell.appendChild(tile)
    }
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
    const output = [];
    for (let i = 0, row; row = table.rows[i]; i++) {
        const rowOut = [];
        for (let j = 0, cell; cell = row.cells[j]; j++) {
            const cellOut = []
            let collide;
            for (let h = 0; h < row.cells[j].childNodes.length; h++){
                if (row.cells[j].childNodes[h].classList.contains('collide')) 
                    collide = true;
                // cellOut.push(parseInt(row.cells[j].childNodes[h].id) != null ?  parseInt(row.cells[j].childNodes[h].id) : 0)
                // console.log(parseInt(row.cells[j].childNodes[h].id) != null)
                if (parseInt(row.cells[j].childNodes[h].id) != null) {
                    cellOut.push(parseInt(row.cells[j].childNodes[h].id))
                }     
                else {
                    cellOut.push(0)
                }  
            }
            if ( collide)
                cellOut.push(-1)
            //console.log(row.cells[j].childNodes)  
            rowOut.push(cellOut)
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
            txtValue = td.className.split(' ')[1] + td.className.split(' ')[2]
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