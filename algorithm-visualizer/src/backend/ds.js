exports.List = class List {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

exports.BinaryTreeNode = class BinaryTreeNode {
  constructor(val, left=null, right=null) {
    this.val = val; this.left = left; this.right = right;
  }
}

exports.TreeNode = class TreeNode {
  constructor(val, children=null) {
    this.val = val; this.children = [];
  }

  
}


exports.LinkNode = class LinkNode {
  constructor(val, next=null) {
    this.val = val;
    this.next = next;
  }
}


exports.GraphEdge = class GraphEdge {
  constructor(node1, node2, weight=0) {
    this.node1 = node1;
    this.node2 = node2;
    this.weight =weight;
  }
}

exports.Graph = class Graph {
  constructor(adj_list) { //adj_list is list of graph nodes and graph edges, values of nodes are unique
    this.adj_list = adj_list;
  }

  djikstra(srcval=0) { //return traversal data of djistra pathfinding algorithm
    //assumes all weights are non negative
    console.log("searching for ",srcval, this.adj_list);
    let data = new Map();
    for (let [node,_] of this.adj_list) {
      data.set(node, new Array(Infinity,null,"white")) //dist, parent, visited (gray=seen, black=visited)
    }
    data.get(srcval)[0] = 0;
    data.get(srcval)[2] = "gray";

    let q = [srcval]
    let steps = [[srcval, ...data.get(srcval)]];
    while (q.length > 0) {
      var mindist = data.get(q[0])[0];
      var minnode = q[0];
      var idx = 0; 
      var i = 0;
      for (let node of q) {
        if (data.get(node)[2] === "white" && data.get(node)[0] < mindist){
          minnode = node; mindist = data.get(node)[0]; idx = i;
        }
        i++;
      }

      q.splice(idx,1);
      //console.log(minnode, mindist, data.get(minnode), "Q: ",q);

      data.get(minnode)[2] = "black"; //mark visited
      steps.push([minnode, ...data.get(minnode)]);

      for (let neigabour of this.adj_list.get(minnode)) {
        let nnode = neigabour.node2;
        if (data.get(nnode)[2] === "white") {
          data.get(nnode)[0] = Math.min(data.get(minnode)[0]+neigabour.weight, data.get(nnode)[0])
          data.get(nnode)[2] = "gray";
          data.get(nnode)[1] = minnode;
          steps.push([nnode, ...data.get(nnode)])

          q.push(nnode);
        }

      }
    }
    return [data, steps];
  }

  bfs(srcval, dstval=null) { //unweighted breadth (closest first) first graph traversal
    let data = new Map();
    for (let [node,_] of this.adj_list) {
      data.set(node, new Array(Infinity,null,"white")) 
    }
    data.get(srcval)[0] = 0;
    data.get(srcval)[2] = "gray";

    let q = [srcval]
    let steps = [[...data.get(srcval)]];

    while (q.length > 0) {
      let curr = q.splice(0,1)[0]; //pop oldest added element, breadth first
      console.log(curr, q);
      data.get(curr)[2] = "black"; //mark visited
      steps.push([curr, ...data.get(curr)]);

      for (let neigabour of this.adj_list.get(curr)) {
        let nnode = neigabour.node2;
        if (data.get(nnode)[2] === "white") {
          data.get(nnode)[0] = Math.min(data.get(curr)[0]+neigabour.weight, data.get(nnode)[0])
          data.get(nnode)[2] = "gray";
          data.get(nnode)[1] = curr;
          steps.push([nnode, ...data.get(nnode)])

          q.push(nnode);
        }

      }
    }
    return [data, steps];
  }

  dfs(srcval, dstval=null) { //unweighted depth (furthest first) first graph traversal
    let data = new Map();
    for (let [node,_] of this.adj_list) {
      data.set(node, new Array(Infinity,null,"white")) 
    }
    data.get(srcval)[0] = 0;
    data.get(srcval)[2] = "gray";

    let q = [srcval]
    let steps = [[...data.get(srcval)]];

    while (q.length > 0) {
      let curr = q.pop(); //pop newest/furthest added element, depth first
      console.log(curr, q);
      data.get(curr)[2] = "black"; //mark visited
      steps.push([curr, ...data.get(curr)]);

      for (let neigabour of this.adj_list.get(curr)) {
        let nnode = neigabour.node2;
        if (data.get(nnode)[2] === "white") {
          data.get(nnode)[0] = Math.min(data.get(curr)[0]+neigabour.weight, data.get(nnode)[0])
          data.get(nnode)[2] = "gray";
          data.get(nnode)[1] = curr;
          steps.push([nnode, ...data.get(nnode)])

          q.push(nnode);
        }

      }
    }
    return [data, steps];
  }
}

