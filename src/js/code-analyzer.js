import * as esprima from 'esprima';
// var esprima = require('esprima');
import * as escodegen from 'escodegen';
// var escodegen = require('escodegen');
import * as esgraph from 'esgraph';
// var esgraph = require('esgraph');


let args = [];
let vars = [];
let codeToEval;
let nodesToColor;
let dotType;

const parseCode = (codeToParse, argus) => {
    args = [];
    vars = [];
    nodesToColor =[];
    codeToEval='';
    let parsedCode = esprima.parseScript(codeToParse , {loc: true, range: true});
    makeArgsList(argus);
    var indexOfFunc = makeVarList(JSON.parse(JSON.stringify(parsedCode)));
    codeToEval += makeCodeToEval();
    var cfg = esgraph(parsedCode.body[indexOfFunc].body);
    var dotConcrete = esgraph.dot(cfg, {counter: 0, source: codeToParse});
    dotType = esgraph.dot(cfg, {counter: 0});
    var graph = makeGraph(dotConcrete);
    return graph;
};

function makeGraph(dotConcrete) {
    var splitDots = splitStringIntoArr(dotConcrete);
    var nodes = splitDots[0];
    var edges = splitDots[1];//last element in the arr is emptylist, may cuase problems
    // var name = 'n1';
    // var label = getLabel(name, nodes);
    // // var node = getNodeByName(name);
    travel(getNode(nodes[0]), nodes, edges);
    nodes = colorAndNumByName(nodes);
    chganeShape(nodes);
    return ArrToString(nodes,edges);
}
function travel(node ,nodes, edges) {
    nodesToColor.push(node);
    codeToEval += getLabel(node, nodes)+';';
    var nextEdges = getNextEdges(node, edges);
    if(nextEdges.length > 1){
        if(eval(codeToEval)){//assuming true label is allways first
            codeToEval+=';';
            travel(getNextNode(nextEdges[0]), nodes, edges);
        }
        else{
            codeToEval+=';';
            travel(getNextNode(nextEdges[1]), nodes, edges);
        }
    } else if(nextEdges.length == 1){
        travel(getNextNode(nextEdges[0]), nodes, edges);
    }

}

function splitStringIntoArr(dotC) {
    var index = dotC.indexOf('->') - 3;//const
    var nodes = dotC.substring(0,index-1).split('\n');
    var edges = dotC.substring(index).split('\n').filter((str)=>{return !(str.includes('exception'));}).slice(1);
    return [nodes.slice(1, nodes.length-1), edges.filter((str)=>{return !str.includes(nodes[nodes.length-1].split(' ')[0]);})];
}
function ArrToString(nodes, egdes) {
    return nodes.join('\n')+'\n'+egdes.join('\n');
}

function makeArgsList(argus){
    var idx = 1;
    argus = argus.trim();
    if(argus === '') {return '';}
    else if(argus.charAt(0)===','){
        return makeArgsList(argus.substr(idx));}
    else if(makeArgsListHelper(argus)!=-1){
        idx += makeArgsListHelper(argus);}
    else{
        var comaIdx = argus.indexOf(',');
        idx += comaIdx === -1? argus.length:comaIdx-1;}
    args.push(argus.substring(0,idx));
    argus = argus.substr(idx);
    makeArgsList(argus);
}
function makeArgsListHelper(argus){
    if(argus.charAt(0)==='['){
        return argus.indexOf(']');
    }
    else if(argus.charAt(0)==='\'')
    {
        return argus.indexOf('\'',1);
    }
    else if(argus.charAt(0)==='"'){
        return argus.indexOf('"',1);
    }
    else return -1;
}
function makeVarList(prog){
    var index;
    for(let i=0;i<prog.body.length;i++){
        if(prog.body[i].type == 'FunctionDeclaration'){
            prog.body[i].params.map((element)=> vars.push(element.name));
            index = i;
            break;
        }
        else { codeToEval += escodegen.generate(prog.body[i]);}
    }
    return index;
}
function makeCodeToEval() {
    var code = '';
    for(let i=0; i<vars.length;i++){
        code += ' let '+vars[i]+' = '+args[i]+'; ';
    }
    return code;
}
function getNodeByName(node, nodes) {
    return nodes.filter((s)=>s.includes(node))[0];
}
function getLabel(node, nodes){
    var str = getNodeByName(node, nodes);
    var substr = str.substring(str.indexOf('"')+1);
    return substr.substring(0, substr.indexOf('"'));
}
function getNode(str){
    return str.split(' ')[0];
}
function getNextNode(str){
    return str.split(' ')[2];
}
function getNextEdges(node, edges){
    return edges.filter((s)=>s.includes(node+' ->'));
}
function colorAndNumByName(nodes){
    return nodes.map((node, i)=>{
        var str1 = 'label=" ['+i+']\n';
        var str2 = node.replace('label="',str1);
        if(nodesToColor.includes(getNode(node)))
        {
            return str2.substr(0,str2.length-1)+' ,style=filled,fillcolor ="green"]';
        }
        else return str2;
    });
}
function chganeShape(nodes){
    var types = dotType.split('\n');
    const rightValues = ['Literal', 'Identifier', 'BinaryExpression', 'MemberExpression', 'UnaryExpression', 'ArrayExpression', 'LogicalExpression'];
    var str;
    for(var i=0 ; i<nodes.length;i++){
        if(rightValues.includes(getLabel(types[i+1], types))){
            str = nodes[i];
            nodes[i] = str.substr(0,str.length-1)+' ,shape=diamond]';
        }
        else{
            str = nodes[i];
            nodes[i] = str.substr(0,str.length-1)+' ,shape=box]';
        }

    }
}

// module.exports = {parseCode};
export {parseCode, getNode, getNextNode};