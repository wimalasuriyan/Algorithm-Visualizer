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

  djikstra(srcval, dstval=null) { //return traversal data of djistra pathfinding algorithm
    let starttime = Date.now();
    //assumes all weights are non negative
    let data = new Map();
    for (let [node,_] of this.adj_list) {
      data.set(node, new Array(Infinity,null,"white")) //dist, parent, visited (gray=seen, black=visited)
    }
    data.get(srcval)[0] = 0;
    data.get(srcval)[1] = srcval;
    data.get(srcval)[2] = "orange";

    //console.log(data);

    let dstfound = false;
    let q = [srcval]
    let steps = [];
    steps.push([srcval, "", ...data.get(srcval)]);
    while (q.length > 0) {
      var mindist = data.get(q[0])[0];
      var minnode = q[0];
      var idx = 0;
      var i = 0;
      for (let node of q) { //pick the next closest node in q
        if (data.get(node)[2] === "white" && data.get(node)[0] < mindist){
          minnode = node; mindist = data.get(node)[0]; idx = i;
        }
        i++;
      }

      q.splice(idx,1);
      data.get(minnode)[2] = "cyan"; //mark visited
      if (minnode !== srcval)
        steps.push([minnode, (minnode+","+data.get(minnode)[1]+""+mindist), ...data.get(minnode)]);

      if (minnode !== dstval)
        for (let neigabour of this.adj_list.get(minnode)) {
          let nnode = neigabour.node2;
          //console.log("nnode:", neigabour);

          if (data.get(nnode)[2] === "white") {
            data.get(nnode)[0] = Math.min(data.get(minnode)[0]+neigabour.weight, data.get(nnode)[0])
            data.get(nnode)[2] = "orange";
            data.get(nnode)[1] = minnode;
            if (nnode == dstval) {
              dstfound = true;
              break;
            }
            steps.push([nnode, neigabour.node1+","+neigabour.node2+","+neigabour.weight, ...data.get(nnode)]);
            q.push(nnode);
          }
        }
      else { //found dst val
        steps.push([minnode, (minnode+","+data.get(minnode)[1]+","+mindist), ...data.get(minnode)]);
      }
      data.get(minnode)[2] = "gray"; //mark visited
      if (minnode !== srcval)
        steps.push([minnode, "", ...data.get(minnode)]);


      if (minnode == dstval || dstfound)
        break;
    }

    let path = [];
    if (dstval !== null) {
      let curr = dstval;
      //curr = data.get(curr)[1];

      while (curr!== null && curr !== -1 && curr !== srcval) {
        console.log(curr);
        path.push(curr);
        data.get(curr)[2] = "yellow";
        steps.push([curr, "", ...data.get(curr)]);
        curr = data.get(curr)[1];
      }
      path.push(srcval);
    }
    return [data, steps, path, Date.now()-starttime];
  }

  bfs(srcval, dstval=null, sectionNo=0, data=null) { //unweighted breadth (closest first) first graph traversal
    let starttime = Date.now();
    if (data === null) {
      data = new Map();
      for (let [node,_] of this.adj_list) {
        data.set(node, new Array(Infinity,null,"white", -1)) 
      }
    }

    data.get(srcval)[0] = 0;
    data.get(srcval)[1] = srcval;
    data.get(srcval)[2] = "orange";
    data.get(srcval)[3] = sectionNo;

    let dstfound = false;
    let q = [srcval]
    let steps = [];
    while (q.length > 0) {
      let curr = q.splice(0,1)[0]; //pop oldest added element, breadth first
      if (curr !== srcval) {
       data.get(curr)[2] = "cyan"; //mark visited
       steps.push([curr, ...data.get(curr)]);
      }

      for (let neigabour of this.adj_list.get(curr)) {
        let nnode = neigabour.node2;

        if (data.get(nnode)[2] === "white") {
          data.get(nnode)[0] = Math.min(data.get(curr)[0]+neigabour.weight, data.get(nnode)[0])
          data.get(nnode)[2] = "orange";
          data.get(nnode)[1] = curr;
          data.get(nnode)[3] = sectionNo;
          if (nnode == dstval) {
            dstfound = true;
            break;
          }
          steps.push([nnode, ...data.get(nnode)])
          q.push(nnode);
        }
      }

      if (curr !== srcval) {
       data.get(curr)[2] = "gray"; //mark visited
       steps.push([curr, ...data.get(curr)]);
      }
      if (curr == dstval || dstfound)
        break;
    }

    let path = [];
    if (dstval != null) {
      let curr = dstval;
      curr = data.get(curr)[1];

      while (curr !== null && curr !== -1 && curr !== srcval) {
        path.push(curr);
        data.get(curr)[2] = "yellow";
        steps.push([curr, ...data.get(curr)]);
        curr = data.get(curr)[1];
      }
      path.push(srcval);
    }
    return [data, steps, path, Date.now()-starttime];
  }

  dfs(srcval, dstval=null) { //unweighted depth (furthest first) first graph traversal
    let starttime = Date.now();

    let data = new Map();
    for (let [node,_] of this.adj_list) {
      data.set(node, new Array(Infinity,null,"white")) 
    }
    data.get(srcval)[0] = 0;
    data.get(srcval)[1] = srcval;
    data.get(srcval)[2] = "orange";

    let dstfound = false;
    let q = [srcval]
    let steps = [];

    while (q.length > 0) {
      let curr = q.pop(); //pop newest/furthest added element, depth first
      if (curr !== srcval) {
        data.get(curr)[2] = "cyan"; //mark visited
        steps.push([curr, ...data.get(curr)]);
      }
      for (let neigabour of this.adj_list.get(curr)) {
        let nnode = neigabour.node2;
        if (data.get(nnode)[2] === "white") {
          data.get(nnode)[0] = Math.min(data.get(curr)[0]+neigabour.weight, data.get(nnode)[0]);
          data.get(nnode)[2] = "orange";
          data.get(nnode)[1] = curr;

          if (nnode === dstval) {
            dstfound = true;
            break;
          }
          steps.push([nnode, ...data.get(nnode)]);
          q.push(nnode);
        }

      }
      if (curr === dstval || dstfound)
        break;
    }

    let path = [];
    if (dstval != null) {
      let curr = dstval;
      curr = data.get(curr)[1];

      while (curr !== null && curr !== -1 && curr !== srcval) {
        path.push(curr);
        data.get(curr)[2] = "yellow";
        steps.push([curr, ...data.get(curr)]);
        curr = data.get(curr)[1];
      }
      console.log(curr, srcval, path)
      path.push(srcval);
    }
    return [data, steps, path, Date.now()-starttime];
  }
}

