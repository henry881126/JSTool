//  字典翻译
export function publicLableValueC(data,val){
    let getLabel = ''
      data.forEach(item=>{
        if(item.value == val){
          getLabel = item.label
          
        } 
      })  
      return getLabel
  } 
  export function setIndex(data)  {
    let queue = [...data];
    let loop = 0;
    while (queue.length > 0) {
      loop++
      [...queue].forEach((child, i) => {
        queue.shift()
        if (loop == 1) {
          child.customIndex = i + 1 + "";
          child.currentIndex = i;
        }
        if (child.childs && child.childs.length > 0) {
          child.dataType = 1
          for (let ci = 0; ci < child.childs.length; ci++) {
            child.childs[ci].currentIndex = ci
            child.childs[ci].customIndex = child.customIndex + "." + (ci + 1)
          }
          queue.push(...child.childs)
        } else {
          child.dataType = 2
        }
      })
    }
  }
  export function getPathByKey(value, key, arr)  {
    let temppath = [];
    let realPath = ""
    try {
      function getNodePath(node) {
        temppath.push(node.currentIndex);
        //找到符合条件的节点，通过throw终止掉递归
        if (node[key] === value) {
          temppath.forEach((v, i) => {
            if (i == 0) {
              realPath += "." + v
            } else {
              realPath += `.childs.${v}`
            }
          })
          // temppath = temppath.join(",")
          throw ("GOT IT!");
          // return;
        }
        if (node.childs && node.childs.length > 0) {
          for (var i = 0; i < node.childs.length; i++) {
            getNodePath(node.childs[i]);
          }

          //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
          temppath.pop();
        } else {

          //找到叶子节点时，删除路径当中的该叶子节点
          temppath.pop();
        }
      }

      for (let i = 0; i < arr.length; i++) {
        getNodePath(arr[i]);
      }
    } catch (e) {
      return realPath;
    }
  }