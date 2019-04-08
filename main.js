const table = document.getElementById('editorGrid');
const dragItems = document.getElementsByClassName('dragItem');
const assetsTable = document.getElementById('assets');
const exportBtn = document.getElementById('exportBtn');
const editor = {
    blockX: 1,
    blockY: 1
}

editor.blockX = localStorage.getItem('width') || 1
editor.blockY = localStorage.getItem('height') || 1
let lastClick;


table.ondrop = (e) => drop(e)
table.ondragover = (e) => allowDrop(e)


const click = e => {
    console.log(e)
    if (e.target.id === 'editorGrid') {
        return
    }
    if (!e.target.classList.contains('dragItem')) {
        //alert('sss')
        e.target.appendChild(document.getElementById(lastClick).cloneNode());
    }
    if (e.target.classList.contains('dragItem')) {
        lastClick = e.target.id;
        console.log(lastClick)
    }

}

table.addEventListener('click', click)

for (let i = 0; i < dragItems.length; i++) {
    dragItems[i].draggable = true;
    dragItems[i].ondragstart = (e) => drag(e)
    dragItems[i].addEventListener('click', click)
}

table.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log(e.target)
    if (e.target.className !== 'dragItem') return
    e.target.parentElement.removeChild(e.target)
    //table.removeChild(e.target)
})


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

const imagesAssets = [];

document.getElementById('fileUpload')
    .addEventListener('change', loadFiles, false);



function loadFiles(e) {
    let files = event.target.files || e.originalTarget.files;
    let pos = 0;
    let rowNum = 0;

    const rowLength = files.length / 4
    for (let i = 0; i < rowLength; i++) {
        const row = assetsTable.insertRow(rowNum)
    }

    for (let i = 0; i < files.length; i++) {

        let fileType = files[i].name.split('.').pop();
        let fileCategory = files[i].name.split('-').slice()[0];
        let fileId = files[i].name.split('-')[1].split('.').slice()[0];

        imagesAssets.push(new Image());
        imagesAssets[i].src = URL.createObjectURL(files[i]);

        const row = assetsTable.rows[rowNum]
        const cell = row.insertCell(pos);

        const tile = document.createElement('div');
        tile.className = `dragItem ${fileCategory}`
        tile.style.backgroundImage = `url(${URL.createObjectURL(files[i])})`
        tile.setAttribute('id', fileId)
        tile.addEventListener('click', click)
        cell.appendChild(tile)
    }
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

makeGrid()

const updateGrid = (e) => {
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    console.log(e.target.value)
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
    let tr = assetsTable.getElementsByTagName("td");
    console.log(query)

    console.log(tr.length)
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("div")[0];
        console.log(td)
        if (td) {
            txtValue = td.className.split(' ')[1]
            console.log( td.className.split(' ')[1] )
            if (txtValue.indexOf(query) > -1) {
                td.style.display = "";
            } else {
                td.style.display = "none";
            }
        }
    }
}
