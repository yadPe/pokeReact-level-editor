const table = document.getElementById('editorGrid');
let dragItems = document.getElementsByClassName('dragItem');
let editor = {
    blockX: 10,
    blockY: 10
}


table.ondrop = (e) => drop(e)
table.ondragover = (e) => allowDrop(e)


let lastClick;
const click = e => {
    console.log(e)
    if (e.target.id === 'editorGrid') {
        return
    }
    if (e.target.className !== 'dragItem') {
        //alert('sss')
        e.target.appendChild(document.getElementById(lastClick).cloneNode());
    }
    if (e.target.className === 'dragItem') {
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


for (let i = 0; i < editor.blockY; i++) {
    let row = document.createElement('tr');
    row.className = `tr${i}`
    table.appendChild(row)
    for (let j = 0; j < editor.blockX; j++) {
        let cell = document.createElement('td')
        cell.className = `td${j}`

        // let div = document.createElement('div');
        // cell.appendChild(div)

        row.appendChild(cell)
    }
}

//let src;
const drag = e => {
    //src = e.srcElement.parentNode.parentNode.parentNode.id === '' ? e.srcElement.parentNode.parentNode.parentNode.parentNode.id : e.srcElement.parentNode.parentNode.parentNode.id
    //console.log(src)
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


const exportMatrix = () => {
    let output = [];
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        let rowOut = [];

        for (let j = 0, cell; cell = row.cells[j]; j++) {
            //iterate through columns
            //columns would be accessed using the "col" variable assigned in the for loop
            //console.log(cell.firstChild)
            rowOut.push(cell.firstChild ?  cell.firstChild.id : 1)
        }

        output.push(rowOut);
    }
    return output
}


document.getElementById('fileUpload')
    .addEventListener('change', loadFiles, false);



    function loadFiles(e) {
        let files = event.target.files || e.originalTarget.files;
    
        for (let i = 0; i < files.length; i++) {
            
        }
    }
