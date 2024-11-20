
//tods : input To Data Structures
var ds = require("./ds");

function toBinaryTree(input) {
	//input is array representing tree's values, 
	
	let level = 1;
	let root = new ds.BinaryTreeNode(input[0]);
	let lvl = [root];
	let i = 1;
	while (i < input.length) {
		let j = i;
		let newlvl = [];
		for (let node of lvl) {
			node.left = new ds.BinaryTreeNode(input[j]);
			node.right = new ds.BinaryTreeNode(input[j+1]);
			newlvl.push(node.left);
			newlvl.push(node.right);
			j+=2;
		}
		lvl = newlvl;
		i=j;
		level++;
	}
	return root;
}

function toTree(input) {

}

function toLinkList(input, circular=false) {
	if (input.length === 0)
		return null;
	var head = new ds.LinkNode(input[0]);
	var curr = head
	for (let i = 1; i < input.length; i++) {
		curr.next = new ds.LinkNode(input[i]);
		curr = curr.next;
	}
	if (circular)
		curr.next = head;
	return head;
}

function toList(input) {
	return input;
}


exports.gridToGraph = (grid) => { //2d grid to graph

	let nodevals = [];
	let edgevals = [];
	let rows = grid.length;
	let cols = grid[0].length;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (grid[row][col] == 1)
				continue;
			let nodeval = row*cols+col;
			nodevals.push(nodeval);
			if (nodeval+cols < rows*cols && grid[row+1][col] == 0) 
				edgevals.push([nodeval, nodeval+cols,1]);
			if (nodeval-cols > -1 && grid[row-1][col] == 0)
				edgevals.push([nodeval, nodeval-cols,1]);
			if (nodeval%cols+1 < cols && grid[row][col+1] == 0)
				edgevals.push([nodeval, nodeval+1,1]);
			if (nodeval%cols -1  > -1 && grid[row][col-1] == 0)
				edgevals.push([nodeval, nodeval-1,1]);
		}
	}
	return toGraph(nodevals, edgevals);
};

function toGraph(nodevals, edgevals, undirected=false) {
	if (undirected) {
		let len = edgevals.length;
		for (let i = 0; i < len; i++) {
			edgevals.push([edgevals[i][1],edgevals[i][0],edgevals.length==3?edgevals[i][2]:0])
		}
	}
    let adj_list = new Map(); //maps nodes to edges

    for (let edgeval of edgevals) {
    	let node1 = edgeval[0];
    	let node2 = edgeval[1];
    	let edge = new ds.GraphEdge(node1, node2, edgeval.length==3?edgeval[2]:0);
    	if (adj_list.get(node1)) {
     		adj_list.get(node1).push(edge);
    	}
     	else {
     		adj_list.set(node1,new Array(edge));
     	}
    }
    return new ds.Graph(adj_list);
}

/*
let x = toLinkList([1,2,4,4]);
//console.log(x.val, x.next.val);

//let y = toGraph(new Array(1,2,3), new Array([1,2], [2,3]));
//console.log(y.adj_list.get(2))

let z = gridToGraph([[0,0,1,0],[0,0,0,0],[0,0,0,1],[0,1,1,1]]);
for (const [k,v] of z.adj_list.entries()) {
	//console.log(k,v)
	for (j of v) {
	//	console.log(k, j)
	}
	//console.log();
}


 b = z.dfs(0);
 for (let j of b[1])
 console.log(j)
*/

//let c = toTree([0,1,2,3,4,5,6])
//console.log(c);


