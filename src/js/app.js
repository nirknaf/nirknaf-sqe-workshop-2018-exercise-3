import $ from 'jquery';
import {parseCode} from './code-analyzer';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let argus = $('#codePlaceholder2').val();
        let parsedCode = parseCode(codeToParse, argus);
        $('#parsedCode').val(parsedCode);

        let viz = new Viz({ Module, render });

        viz.renderString('digraph { ' +  parsedCode + ' }')
            .then(function(graph) {
                document.getElementById('code').innerHTML = graph;
            });
    });
});
