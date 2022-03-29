// import { jsx } from '@autolib/autodom';

import { Parser } from 'acorn';
import jsx from 'acorn-jsx';

import square_src from './tests/TicTacToeFull.jsx?raw';

// not used but forced vite to reload
import * as autodom from '@autolib/autodom';
window.autodom = autodom;

let source_el = document.querySelector('#source');
let jsx_ast_el = document.querySelector('#jsx-ast');
let babel_react_el = document.querySelector('#babel-react');

let jsx_ast = Parser.extend(jsx()).parse(square_src, { ecmaVersion: 6 });

source_el.innerHTML = square_src;
jsx_ast_el.innerHTML = JSON.stringify(jsx_ast, null, 4);

import { transform } from '@babel/standalone';
// https://github.com/babel/babel/issues/8451#issuecomment-412123252
// https://babeljs.io/docs/en/babel-plugin-transform-react-jsx
let code = transform(square_src, {
    plugins: [
        ["transform-react-jsx", { "runtime": "automatic" }]
    ]
}).code;


babel_react_el.innerHTML = code;

let newcode = transform(square_src, {
    presets: ['react']
}).code;

newcode = newcode.replace(`getElementById("root")`, "getElementById('root-react')");

var F = new Function(newcode);

F();

document.querySelector("#react-dom").innerHTML = document.querySelector("#root-react").innerHTML;

code = code.replace('import { jsxs as _jsxs } from "react/jsx-runtime";\n', '');
code = code.replace('import { jsx as _jsx } from "react/jsx-runtime";\n', '');
code = code.replaceAll('_jsxs', 'autodom.jsxs');
code = code.replaceAll('_jsx', 'autodom.jsx');
code = code.replaceAll("/*#__PURE__*/", '');
code = code.replace(`getElementById("root")`, "getElementById('autodom-render')");
code = code.replace("ReactDOM.render", "autodom.render");

document.querySelector("#autodom-jsx").innerHTML = code;

new Function(code)();

document.querySelector("#autodom-html").innerHTML = document.querySelector("#autodom-render").innerHTML;