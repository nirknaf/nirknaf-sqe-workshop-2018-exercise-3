import assert from 'assert';
import {parseCode, getNode, getNextNode} from '../src/js/code-analyzer';


describe('The javascript parser', () => {
    it('is parsing the first function correctly with input=1,2,3', () => {
        assert.equal((parseCode(
            'let f =0;\n' +
            'function foo(x, y, z, g, h){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n', '1,2,3, [1,3],\'nir\',"nif" ')), 'n1 [label=" [0]\n' +
            'let a = x + 1;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n2 [label=" [1]\n' +
            'let b = a + y;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n3 [label=" [2]\n' +
            'let c = 0;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n4 [label=" [3]\n' +
            'b < z" ,style=filled,fillcolor ="green" ,shape=diamond]\n' +
            'n5 [label=" [4]\n' +
            'c = c + 5" ,shape=box]\n' +
            'n6 [label=" [5]\n' +
            'return c;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n7 [label=" [6]\n' +
            'b < z * 2" ,style=filled,fillcolor ="green" ,shape=diamond]\n' +
            'n8 [label=" [7]\n' +
            'c = c + x + 5" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n9 [label=" [8]\n' +
            'c = c + z + 5" ,shape=box]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n6 []\n' +
            'n9 -> n6 []\n');
    });

    it('is parsing the first function correctly with input=1,2,3', () => {
        assert.equal(parseCode('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a=a+1;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n','10,2,3') , 'n1 [label=" [0]\n' +
            'let a = x + 1;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n2 [label=" [1]\n' +
            'let b = a + y;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n3 [label=" [2]\n' +
            'let c = 0;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n4 [label=" [3]\n' +
            'a < z" ,style=filled,fillcolor ="green" ,shape=diamond]\n' +
            'n5 [label=" [4]\n' +
            'c = a + b" ,shape=box]\n' +
            'n6 [label=" [5]\n' +
            'z = c * 2" ,shape=box]\n' +
            'n7 [label=" [6]\n' +
            'a=a+1" ,shape=box]\n' +
            'n8 [label=" [7]\n' +
            'return z;" ,style=filled,fillcolor ="green" ,shape=box]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n4 []\n');});

    it('getNode', () => {
        assert.equal(getNode('n2 [label=" [1]\n' +
            'let b = a + y;" ,style=filled,fillcolor ="green" ,shape=box]\n'), 'n2');});

    it('getNode', () => {
        assert.equal(getNode('n211 [label=" [1]\n' +
            'let b = a + y;" ,style=filled,fillcolor ="green" ,shape=box]\n'), 'n211');});

    it('getNode', () => {
        assert.equal(getNode('n [label=" [1]\n' +
            'let b = a + y;" ,style=filled,fillcolor ="green" ,shape=box]\n'), 'n');});

    it('getNode', () => {
        assert.equal(getNode('n2111 [label=" [1]\n' +
            'let b = a + y;" ,style=filled,fillcolor ="green" ,shape=box]\n'), 'n2111');});

    it('getNextNode', () => {
        assert.equal(getNextNode('n4 -> n5 [label="true"]\n'), 'n5');});

    it('getNextNode', () => {
        assert.equal(getNextNode('n4 -> n611 [label="true"]\n'), 'n611');});

    it('getNextNode', () => {
        assert.equal(getNextNode('n4 -> n [label="true"]\n'), 'n');});

    it('getNextNode', () => {
        assert.equal(getNextNode('n4 -> n6112 [label="true"]\n'), 'n6112');});
});


// describe('The javascript parser', () => {
//     it('is parsing the first madeup function correctly with input=[10,20],\'nir\',"nir"', () => {
//         assert.equal((parseCode('function check(x, y, z) {\n' +
//             '    let a = x[0];\n' +
//             '    if(y === \'nir\'){\n' +
//             '        return z;\n' + '    }\n' +
//             '    else if(y === "nir"){\n' +
//             '        return y;\n' +
//             '    }\n' +
//             '    else if(a<5){\n' +
//             '        return x;\n' +
//             '    }\n' +
//             '}','[10,20],\'nir\',"nir"')), 'function check(x, y, z) {\n' +
//             '<greenBack>    if (y === \'nir\') {</greenBack>\n' +
//             '        return z;\n' +
//             '<greenBack>    } else if (y === \'nir\') {</greenBack>\n' +
//             '        return y;\n' +
//             '<redBack>    } else if (x[0] < 5) {</redBack>\n' +
//             '        return x;\n' +
//             '    }\n' +
//             '}\n');});});
// describe('The javascript parser', () => {
//     it('is parsing the second madeup function correctly with input=[10,20], 2,"nir"', () => {
//         assert.equal((parseCode('function check2(x,y,z) {\n' +
//             '    let a;\n' +
//             '    a = y *2;\n' +
//             '    let  b = 2*a++;\n' +
//             '    x[0] = ++a;\n' +
//             '    b = [1,2];\n' +
//             '    b = true;\n' +
//             '    if(x[0]<10 & !b){\n' +
//             '        return z;\n' +
//             '    }\n' +
//             '}','[10,20], 2,"nir"')), 'function check2(x, y, z) {\n' +
//             '<redBack>    if (x[0] < 10 & !true) {</redBack>\n' +
//             '        return z;\n' +
//             '    }\n' +
//             '}\n');});});