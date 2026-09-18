const cellSize = 50
const gap = 6
const offset =100

let problemIndex = 0
let problemType = 1
const problems = [
    {
        'dimensions':[
            ['Ted', 'Ken', 'Allyson', 'Janie'],
            ['Running', 'Swimming', 'Biking', 'Golf'], 
        ],
        'steps':[
            ['Ted', 'Golf', false, "Ted hates golf, He agrees with Mark Twain that golf is nothing but a good walk spoiled"],
            ['Ken', 'Running', false, "Ken wouldn't run around the block if he didn't have to, and neither would his wife"],
            ['Allyson', 'Golf', false, "Each womans favorite sport is featured in a traithalon"],
            ['Janie', 'Golf', false],
            ['Ted', 'Biking', true],
            ['Janie', 'Swimming', true],
            ['Allyson', 'Running', true]
        ]
    },
    {
        'dimensions':[
            ['Tom', 'John', 'Fred', 'Bill'],
            ['Nurse', 'Secretary', 'Teacher', 'Pilot'], 
            ['Hamburger','Chicken','Steak','Hot Dog'], 
        ],
        'steps':[
            ['Tom','Nurse',false],
            ['Tom','Teacher',false],
            ['Fred','Pilot',false],
            ['Fred','Hamburger',false],
            ['Fred','Teacher',false],
            ['Hamburger','Teacher',false],
            ['Hamburger','Pilot',false],
            ['Tom','Hot Dog',true],
            ['Bill','Hamburger',false],
            ['Bill','Steak',false],
            ['Bill','Chicken',true],
            ['Fred','Steak',true],
            ['John','Hamburger',true],
            ['Fred','Secretary',false],
            ['Nurse','Steak',true],
            ['John','Pilot',false],
            ['Hamburger','Secretary',true],
            ['John','Secretary',true],
            ['Tom','Pilot',true],
            ['Bill','Teacher',true],
            ['Chicken','Teacher',true],
            ['Pilot','Hot Dog',true],
        ]
    },
    {
        'dimensions':[
            ['Tom', 'John', 'Fred', 'Bill'],
            ['Anderson', 'Thompson', 'Molash', 'Appleton'],
            ['Nurse', 'Secretary', 'Teacher', 'Pilot'], 
            ['Hamburger','Chicken','Steak','Hot Dog'], 
        ],
        'steps':[
            ['Tom','Nurse',false],
            ['Tom','Teacher',false],
            ['Fred','Pilot',false],
            ['Hot Dog','Thompson',false],
            ['Fred','Hamburger',false],
            ['Fred','Teacher',false],
            ['Hamburger','Thompson',false],
            ['Hamburger','Teacher',false],
            ['Hamburger','Pilot',false],
            ['Tom','Hot Dog',true],
            ['Bill','Hamburger',false],
            ['Bill','Steak',false],
            ['Tom', 'Molash',true],
            ['Teacher','Anderson',true],
            ['Bill','Chicken',true],
            ['Anderson','Chicken',true],
            ['Fred','Steak',true],
            ['John','Hamburger',true],
            ['Hot Dog','Molash',true],
            ['Fred','Secretary',false],
            ['Bill','Anderson',true],
            ['Nurse','Steak',true],
            ['John','Pilot',false],
            ['John','Appleton',true],
            ['Hamburger','Appleton',true],
            ['Hamburger','Secretary',true],
            ['Appleton','Secretary',true],
            ['Thompson','Nurse',true],
            ['John','Secretary',true],
            ['Tom','Pilot',true],
            ['Bill','Teacher',true],
            ['Chicken','Teacher',true],
            ['Pilot','Hot Dog',true],
            ['Thompson','Steak',true],
            ['Thompson','Fred',true],
            ['Pilot','Molash',true]
        ]
    },

]


class Node{
    constructor(name, dimension, position, color){
        this.name = name
        this.dimension = dimension
        this.position = position
        this.color = color
        this.edges = new Set()
    }

    addEdge(node){
        this.edges.add({'node':node, 'status': undefined})
    }

    addConnection(node){
        const dimension = node.dimension
        for(const edge of this.edges){
            if(edge['node'] == node){
                edge['status'] = true
                if(this.color != 'white'){
                    edge['node']['color'] = this.color
                }
            }
            else if(edge['node']['dimension'] == node['dimension']){
                edge['status'] = false
            }
        }

        
        
    }

    removeConnection(node){
        for(const edge of this.edges){
            if(edge['node'] == node){
                edge['status'] = false
            }
        }

        //check reamining nodes
        const dimension = node['dimension']
        const remaining = []
        
        for(const edge of this.edges){
            if(edge['status'] == undefined && edge['node']['dimension'] == dimension){
                remaining.push(edge['node'])
            }
        }

        if(remaining.length == 1){
            //only 1 undefined edge left so must be correct one
            this.addConnection(remaining[0])
            remaining[0].addConnection(this)
        }
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    canvasSetUp(canvas)
   

    const dimensions = problems[problemIndex]['dimensions']
    const steps = problems[problemIndex]['steps']
    const adjacencyList = createAdjList(dimensions, [canvas.width, canvas.height])
    const startVisualization = AutoFillList(adjacencyList, steps, updateConnectionByName, 500)
    startVisualization()
    
    
    RAF(canvas, ctx, adjacencyList, dimensions[0].length)
})

const canvasSetUp = (canvas)=>{
    canvas.width = 900;
    canvas.height = 900;
}

const drawMatrix = (ctx, adjList, dimSize) =>{
    const bg = '#6b6b6b'

    const rows = adjList.toSpliced(-dimSize)
    const cols = adjList.slice(dimSize)

    for(let col=0; col<cols.length; col++){
        for(let row=0; row<rows.length; row++){
            const xFloor = Math.floor(col/dimSize)
            const yFloor = Math.floor(row/dimSize)
            
                    
            const x = offset + col*(cellSize+gap)
            const y = offset + row*(cellSize+gap)

            //draw labels
            ctx.font = "10px Arial"
            if(row == 0){
                ctx.fillStyle = 'white'
                ctx.textAlign = 'left'
                ctx.fillText(cols[col]['name'], x, y-gap )
            }
            if( col== 0){
                ctx.fillStyle = 'white'
                ctx.textAlign = 'right'
                ctx.fillText(rows[row]['name'], x-gap, y+(cellSize/2) )
            }

            if(xFloor < yFloor){continue}

            //draw tiles
            ctx.fillStyle = bg
            ctx.fillRect(x, y, cellSize, cellSize)

            //draw edge values
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = "30px Arial"
            const edges = [
                [...adjList[row]['edges']][col]['status'],
                [...adjList[col+dimSize]['edges']][row]['status'],
            ]
            for(const edge of edges){
                if(edge == true){
                ctx.fillStyle = 'lime'
                ctx.fillText('O', x + cellSize/2, y+cellSize/2)
            }
            if(edge == false){
                ctx.fillStyle = 'red'
                ctx.fillText('X', x + cellSize/2, y+cellSize/2)
            }
            }
            

            
            
        }
    }

     
}

const draw2d = (ctx, adjList) =>{
    
    for(const node of adjList){
        //draw lines between all nodes
        for(const edge of node['edges']){
            if(edge['status'] == false){continue}
            const n = edge['node']
            ctx.beginPath()
            ctx.strokeStyle = (edge['status'] == undefined) ? 'red' : edge['node']['color']
            ctx.lineWidth = (edge['status'] == undefined) ? 1: 3
            ctx.moveTo(node['position'][0], node['position'][1])
            ctx.lineTo(n['position'][0], n['position'][1])
            ctx.stroke()
        }
    }

    for(const node of adjList){          
        // draw node location
        ctx.beginPath()
        ctx.arc(node['position'][0], node['position'][1], 10, 0, Math.PI*2)
        ctx.fillStyle = node['color']
        ctx.fill()

        //draw names
        ctx.font = "10px Arial"
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'white'
        ctx.fillText(node['name'], node['position'][0], node['position'][1]-15)
    }
}


const createAdjList = (dimensions, canvasSize) =>{
    const adjList = []

    const randomInt = (max) =>{
        max -=100
        return Math.floor(Math.random()*(max-100+1)) + 100
    }

    for(let i=0; i<dimensions.length; i++){
        const temp = []
        for(const item of dimensions[i]){
            const color = (i==0) ? `hsl(${Math.random() * 360}, 100%, 50%)` : 'white'
            temp.push(new Node(item, i, [randomInt(canvasSize[0]), randomInt(canvasSize[1])], color))
        }
        adjList.push(temp)
    }

    for(const list of adjList){
        const others = adjList.filter(item => item != list).flat()
        for(const item of list){
            for(const other of others){
                item.addEdge(other)
            }
        }
    }
    
    return adjList.flat()
}

const updateConnectionByName = (list, first, second, status) =>{
    
    const node1 = list.filter(item => item['name'] == first)[0]
    const node2 = list.filter(item => item['name'] == second)[0]
   
    if(status == true){
        node1.addConnection(node2)
        node2.addConnection(node1)
    }else{
        node1.removeConnection(node2)
        node2.removeConnection(node1)
    }
}

const AutoFillList = (list, steps, fn, intervalMs=1000) =>{
    let index =0
    return step = () =>{
        if(index >= steps.length){return}
        const current = steps[index]
        fn(list, ...current)
        index++

        setTimeout(step, intervalMs)
    }
}


const RAF = (canvas, ctx, adjList, dimSize) =>{
    ctx.fillStyle = '#2d2c2c'
    ctx.fillRect(0,0,canvas.width, canvas.height)

    if(problemType == 1){
        drawMatrix(ctx, adjList, dimSize)
    }else{
        draw2d(ctx, adjList)
    }
    
    

    requestAnimationFrame(()=>{
        RAF(canvas, ctx, adjList, dimSize)
    })
}


